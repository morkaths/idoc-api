import Redis from 'ioredis';

export class RedisClient {
  private static client: Redis | null = null;

  static get instance(): Redis {
    if (!this.client) {
      throw new Error('Redis client not initialized. Call RedisClient.connect() first.');
    }
    return this.client;
  }

  static async connect(url: string): Promise<void> {
    if (this.client) {
      return;
    }

    this.client = new Redis(url, {
      maxRetriesPerRequest: null,
      retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    this.client.on('error', (err) => {
      console.error('Redis connection error:', err);
    });

    this.client.on('connect', () => {
      console.log('Redis connected');
    });

    // Wait for connection to be ready
    await new Promise<void>((resolve, reject) => {
      this.client!.once('ready', () => {
        resolve();
      });
      this.client!.once('error', (err) => {
        reject(err);
      });
    });
  }

  static async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.client = null;
      console.log('Redis disconnected');
    }
  }

  static async set<T>(key: string, value: T, ttlSeconds = 3600): Promise<void> {
    const redis = this.instance;
    await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  }

  static async get<T>(key: string): Promise<T | null> {
    const redis = this.instance;
    const cached = await redis.get(key);
    return cached ? JSON.parse(cached) : null;
  }

  static async delete(key: string): Promise<void> {
    const redis = this.instance;
    await redis.del(key);
  }

  static async clear(pattern: string): Promise<void> {
    const redis = this.instance;
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }
}
