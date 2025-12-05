import Redis from 'ioredis';
import {
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PASSWORD,
  REDIS_DB,
} from './env.config';

class RedisClient {
  private static instance: Redis | null = null;
  static status = {
    CONNECT: 'connect',
    RECONNECTING: 'reconnecting',
    END: 'end',
    ERROR: 'error',
  } as const;

  static connect(): Redis {
    if (!RedisClient.instance) {
      RedisClient.instance = new Redis({
        host: REDIS_HOST,
        port: REDIS_PORT,
        password: REDIS_PASSWORD,
        db: REDIS_DB,
      });

      RedisClient.instance.on(this.status.CONNECT, () => {
        console.log('Redis connected');
      });

      RedisClient.instance.on(this.status.RECONNECTING, () => {
        console.log('Redis reconnecting...');
      });

      RedisClient.instance.on(this.status.END, () => {
        console.log('Redis connection closed');
      });

      RedisClient.instance.on(this.status.ERROR, (err) => {
        console.error('Redis error:', err);
      });
    }
    return RedisClient.instance;
  }

  static get(): Redis {
    if (!RedisClient.instance) {
      throw new Error('Redis instance not initialized. Call RedisClient.connect() first.');
    }
    return RedisClient.instance;
  }

  static async close(): Promise<void> {
    if (RedisClient.instance) {
      await RedisClient.instance.quit();
      RedisClient.instance = null;
    }
  }
}

export default RedisClient;