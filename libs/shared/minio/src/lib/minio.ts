import { Client, ClientOptions } from 'minio';

export interface MinioConfig extends ClientOptions {
  // Additional config if needed
}

export class MinioClient {
  private static instance: Client | null = null;

  static connect(config: MinioConfig): Client {
    if (!MinioClient.instance) {
      MinioClient.instance = new Client(config);
      console.log('[MinIO] connected via shared library');
    }
    return MinioClient.instance;
  }

  static get(): Client {
    if (!MinioClient.instance) {
      throw new Error('[MinIO] instance not initialized. Call MinioClient.connect() first.');
    }
    return MinioClient.instance;
  }

  static async reset(): Promise<void> {
    MinioClient.instance = null;
    console.log('[MinIO] disconnected');
  }
}
