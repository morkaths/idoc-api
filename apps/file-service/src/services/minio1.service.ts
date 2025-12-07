import MinioClient from '../config/minio.config';
import { MINIO_BUCKET } from '../config/env.config';

MinioClient.connect();

export const MinioService = {
  // Upload file lên MinIO
  async upload(
    objectName: string,
    fileBuffer: Buffer,
    contentType: string,
  ): Promise<{ bucket: string; objectName: string }> {
    const client = MinioClient.get();
    const bucketExists = await client.bucketExists(MINIO_BUCKET);
    if (!bucketExists) {
      await client.makeBucket(MINIO_BUCKET);
    }

    await client.putObject(MINIO_BUCKET, objectName, fileBuffer, fileBuffer.length, {
      'Content-Type': contentType,
    });

    return {
      bucket: MINIO_BUCKET,
      objectName
    };
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

  async stat(objectName: string): Promise<{ size: number; etag: string; metaData: Record<string, any> }> {
    const client = MinioClient.get();
    return await client.statObject(MINIO_BUCKET, objectName);
  },

  // Presigned URL để client upload trực tiếp lên MinIO
  async getPresignedUploadUrl(objectName: string, expirySeconds = 600): Promise<string> {
    const client = MinioClient.get();
    return client.presignedPutObject(MINIO_BUCKET, objectName, expirySeconds);
  },

  // Presigned URL để client tải file về trực tiếp từ MinIO
  async getPresignedDownloadUrl(objectName: string, expirySeconds = 3600): Promise<string> {
    const client = MinioClient.get();
    return client.presignedGetObject(MINIO_BUCKET, objectName, expirySeconds);
  },

}