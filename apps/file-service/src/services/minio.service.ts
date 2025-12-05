import MinioClient from '../config/minio.config';
import { MINIO_BUCKET, MINIO_ENDPOINT, MINIO_PORT, MINIO_USE_SSL } from '../config/env.config';

MinioClient.connect();

export const MinioService = {
  async upload(
    objectName: string,
    fileBuffer: Buffer,
    contentType: string,
  ): Promise<{ bucket: string; fileName: string; url: string }> {
    const client = MinioClient.get();
    const bucketExists = await client.bucketExists(MINIO_BUCKET);
    if (!bucketExists) {
      await client.makeBucket(MINIO_BUCKET);
    }

    await client.putObject(MINIO_BUCKET, objectName, fileBuffer, fileBuffer.length, {
      'Content-Type': contentType,
    });

    const protocol = MINIO_USE_SSL ? 'https' : 'http';
    const endpoint = MINIO_ENDPOINT.replace(/^https?:\/\//, '');
    const port = MINIO_PORT ? `:${MINIO_PORT}` : '';

    return {
      bucket: MINIO_BUCKET,
      fileName: objectName,
      url: `${protocol}://${endpoint}${port}/${MINIO_BUCKET}/${objectName}`
    };
  },

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

  async delete(objectName: string): Promise<void> {
    const client = MinioClient.get();
    await client.removeObject(MINIO_BUCKET, objectName);
  },

  async exists(objectName: string): Promise<boolean> {
    try {
      const client = MinioClient.get();
      await client.statObject(MINIO_BUCKET, objectName);
      return true;
    } catch {
      return false;
    }
  },

  async getPresignedUrl(objectName: string, expirySeconds = 3600): Promise<string> {
    const client = MinioClient.get();
    return await client.presignedGetObject(MINIO_BUCKET, objectName, expirySeconds);
  },

}