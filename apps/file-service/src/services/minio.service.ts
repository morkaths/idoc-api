import { MinioClient } from '@libs/minio';
import { config } from '@libs/config';
import { RedisClient } from '@libs/redis';
import { IFile, StorageProvider } from '../models/file.model';
import { determineFileType } from '../utils/file-type.util';
import { KeyGenerator } from '../utils/key.util';

export const MinioService = {
  // Upload file trực tiếp lên MinIO
  async upload(
    userId: string,
    file: Express.Multer.File
  ): Promise<{ key: string; bucket: string; objectName: string }> {
    const { path: objectName, key } = KeyGenerator.createStoragePath(userId, file.originalname);
    const client = MinioClient.get();
    const bucketExists = await client.bucketExists(config.storage.minio.bucket);
    if (!bucketExists) {
      await client.makeBucket(config.storage.minio.bucket);
    }
    await client.putObject(config.storage.minio.bucket, objectName, file.buffer, file.buffer.length, {
      'Content-Type': file.mimetype,
    });
    return { key, bucket: config.storage.minio.bucket, objectName };
  },

  // Xác nhận upload và lấy metadata
  async confirmUpload(userId: string, key: string): Promise<Partial<IFile>> {
    const pending = await RedisClient.get<Partial<IFile>>(`idoc:file:upload:pending:${key}`);
    if (!pending || !pending.objectName) throw new Error('Upload session expired or not found');
    const client = MinioClient.get();
    const stat = await client.statObject(config.storage.minio.bucket, pending.objectName);
    if (!stat) throw new Error('File not found on storage');

    const mimeType = stat.metaData?.['content-type'] || 'application/octet-stream';

    const metadata: Partial<IFile> = {
      key,
      filename: pending.filename,
      objectName: pending.objectName,
      mimeType,
      type: determineFileType(mimeType),
      size: stat.size,
      bucket: pending.bucket,
      provider: pending.provider,
      uploadedBy: userId
    };

    await RedisClient.delete(`idoc:file:upload:pending:${key}`);
    return metadata;
  },

  // Download file từ MinIO
  async download(objectName: string): Promise<Buffer> {
    const client = MinioClient.get();
    const stream = await client.getObject(config.storage.minio.bucket, objectName);
    const chunks: Buffer[] = [];
    return new Promise((resolve, reject) => {
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });
  },

  // Xóa file khỏi MinIO
  async delete(objectName: string): Promise<void> {
    const client = MinioClient.get();
    await client.removeObject(config.storage.minio.bucket, objectName);
  },

  // Kiểm tra file có tồn tại trên MinIO không
  async exists(objectName: string): Promise<boolean> {
    try {
      const client = MinioClient.get();
      await client.statObject(config.storage.minio.bucket, objectName);
      return true;
    } catch {
      return false;
    }
  },

  // Lấy thông tin file từ MinIO
  async stat(objectName: string): Promise<{ bucket: string; size: number; etag: string; metaData: Record<string, any> }> {
    const client = MinioClient.get();
    const stat = await client.statObject(config.storage.minio.bucket, objectName);
    return {
      bucket: config.storage.minio.bucket,
      size: stat.size,
      etag: stat.etag,
      metaData: stat.metaData
    };
  },

  // Lấy presigned URL để client upload trực tiếp
  async getPresignedUploadUrl(
    userId: string,
    filename: string,
    type: string,
    folder = 'uploads'
  ): Promise<{ url: string; key: string }> {
    const { path: objectName, key } = KeyGenerator.createStoragePath(folder, filename);
    const client = MinioClient.get();
    const url = await client.presignedPutObject(config.storage.minio.bucket, objectName, 600);
    const pendingMetadata: Partial<IFile> = {
      key,
      filename,
      objectName,
      type,
      bucket: config.storage.minio.bucket,
      provider: StorageProvider.MINIO,
      uploadedBy: userId
    };
    await RedisClient.set(`idoc:file:upload:pending:${key}`, pendingMetadata, 600);
    return { url, key };
  },

  // Presigned URL để client tải file về trực tiếp từ MinIO
  async getPresignedDownloadUrl(objectName: string, expirySeconds = 21600): Promise<string> {
    const client = MinioClient.get();
    return client.presignedGetObject(config.storage.minio.bucket, objectName, expirySeconds);
  },
};

export default MinioService;