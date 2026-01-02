import Redis from 'ioredis';
import { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, REDIS_DB } from './env.config';

console.log(`Initializing Redis client at ${REDIS_HOST}:${REDIS_PORT}`);

const redisClient = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
  password: REDIS_PASSWORD,
  db: REDIS_DB,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redisClient.on('connect', () => {
  console.log('Redis client connected');
});

redisClient.on('error', (err) => {
  console.error('Redis client error:', err);
});

export default redisClient;
