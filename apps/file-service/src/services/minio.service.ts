import MinioClient from '../config/minio.config';
import { MINIO_BUCKET } from '../config/env.config';
import { RedisService } from './redis.service';
import { FileType, IFile, StorageProvider } from 'src/models/file.model';
import { KeyGenerator } from '../utils/key.util';

MinioClient.connect();

export const MinioService = {
  // Upload file trực tiếp lên MinIO
  async upload(
    userId: string,
    file: Express.Multer.File
  ): Promise<{ key: string; bucket: string; objectName: string }> {
    const { path: objectName, key } = KeyGenerator.createStoragePath(userId, file.originalname);
    const client = MinioClient.get();
    const bucketExists = await client.bucketExists(MINIO_BUCKET);
    if (!bucketExists) {
      await client.makeBucket(MINIO_BUCKET);
    }
    await client.putObject(MINIO_BUCKET, objectName, file.buffer, file.buffer.length, {
      'Content-Type': file.mimetype,
    });
    return { key, bucket: MINIO_BUCKET, objectName };
  },

  // Xác nhận upload và lấy metadata
  async confirmUpload(userId: string, key: string): Promise<Partial<IFile>> {
    const pending = await RedisService.getCache<Partial<IFile>>(`upload:pending:${key}`);
    if (!pending || !pending.objectName) throw new Error('Upload session expired or not found');
    const client = MinioClient.get();
    const stat = await client.statObject(MINIO_BUCKET, pending.objectName);
    if (!stat) throw new Error('File not found on storage');

    const metadata: Partial<IFile> = {
      key,
      filename: pending.filename,
      objectName: pending.objectName,
      mimeType: stat.metaData?.['content-type'] || 'application/octet-stream',
      type: pending.type,
      size: stat.size,
      bucket: pending.bucket,
      provider: pending.provider,
      uploadedBy: userId
    };

    await RedisService.deleteCache(`upload:pending:${key}`);
    return metadata;
  },

  // Download file từ MinIO
  async download(objectName: string): Promise<Buffer> {
    const client = MinioClient.get();
    const stream = await client.getObject(MINIO_BUCKET, objectName);
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
    await client.removeObject(MINIO_BUCKET, objectName);
  },

  // Kiểm tra file có tồn tại trên MinIO không
  async exists(objectName: string): Promise<boolean> {
    try {
      const client = MinioClient.get();
      await client.statObject(MINIO_BUCKET, objectName);
      return true;
    } catch {
      return false;
    }
  },

  // Lấy thông tin file từ MinIO
  async stat(objectName: string): Promise<{ bucket: string; size: number; etag: string; metaData: Record<string, any> }> {
    const client = MinioClient.get();
    const stat = await client.statObject(MINIO_BUCKET, objectName);
    return {
      bucket: MINIO_BUCKET,
      size: stat.size,
      etag: stat.etag,
      metaData: stat.metaData
    };
  },

  // Lấy presigned URL để client upload trực tiếp
  async getPresignedUploadUrl(
    userId: string,
    filename: string,
    type: FileType
  ): Promise<{ url: string; key: string }> {
    const { path: objectName, key } = KeyGenerator.createStoragePath(userId, filename);
    const client = MinioClient.get();
    const url = await client.presignedPutObject(MINIO_BUCKET, objectName, 600);
    const pendingMetadata: Partial<IFile> = {
      key,
      filename,
      objectName,
      type,
      bucket: MINIO_BUCKET,
      provider: StorageProvider.MINIO,
      uploadedBy: userId
    };
    await RedisService.setCache(`upload:pending:${key}`, pendingMetadata, 600);
    return { url, key };
  },

  // Presigned URL để client tải file về trực tiếp từ MinIO
  async getPresignedDownloadUrl(objectName: string, expirySeconds = 3600): Promise<string> {
    const client = MinioClient.get();
    return client.presignedGetObject(MINIO_BUCKET, objectName, expirySeconds);
  },
};

export default MinioService;