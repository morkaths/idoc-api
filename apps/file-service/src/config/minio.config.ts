import { Client } from 'minio';
import {
  MINIO_ENDPOINT,
  MINIO_PORT,
  MINIO_USE_SSL,
  MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY,
} from './env.config';

class MinioClient {
  private static instance: Client | null = null;

  static connect(): Client {
    if (!MinioClient.instance) {
      MinioClient.instance = new Client({
        endPoint: MINIO_ENDPOINT,
        port: MINIO_PORT,
        useSSL: MINIO_USE_SSL,
        accessKey: MINIO_ACCESS_KEY,
        secretKey: MINIO_SECRET_KEY,
      });
      console.log('MinIO connected');
    }
    return MinioClient.instance;
  }

  static get(): Client {
    if (!MinioClient.instance) {
      throw new Error('MinIO instance not initialized. Call MinioClient.connect() first.');
    }
    return MinioClient.instance;
  }
}

export default MinioClient;