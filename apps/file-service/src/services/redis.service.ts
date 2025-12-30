import RedisClient from '../config/redis.config';

RedisClient.connect();

export const RedisService = {
  async setCache<T>(key: string, value: T, ttlSeconds = 3600): Promise<void> {
    const redis = RedisClient.get();
    await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  },

  async getCache<T>(key: string): Promise<T | null> {
    const redis = RedisClient.get();
    const cached = await redis.get(key);
    return cached ? JSON.parse(cached) : null;
  },

  async deleteCache(key: string): Promise<void> {
    const redis = RedisClient.get();
    await redis.del(key);
  },

  async clearCache(pattern: string): Promise<void> {
    const redis = RedisClient.get();
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  },
};