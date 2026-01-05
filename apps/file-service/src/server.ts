import http from 'http';
import 'reflect-metadata';
import 'multer';

import app from './app';
import { MongoDBClient } from '@libs/mongodb';
import { RedisClient } from '@libs/redis';
import { MinioClient } from '@libs/minio';
import {
  PORT,
  BASE_URL,
  MINIO_ENDPOINT,
  MINIO_PORT,
  MINIO_USE_SSL,
  MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY,
  MONGODB_URI,
  REDIS_URI
} from './config/env.config';
import { logger } from '@libs/logger';

const server = http.createServer(app);

// Kết nối đến MongoDB, Minio
Promise.all([
  MongoDBClient.connect({ uri: MONGODB_URI, logger }),
  RedisClient.connect({ url: REDIS_URI }),
  MinioClient.connect({
    endPoint: MINIO_ENDPOINT,
    port: MINIO_PORT,
    useSSL: MINIO_USE_SSL,
    accessKey: MINIO_ACCESS_KEY,
    secretKey: MINIO_SECRET_KEY,
  }),
]).then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Server running on ${BASE_URL}`);
  });
});

// Xử lý tắt server và đóng kết nối
const gracefulShutdown = async () => {
  console.log("\n Gracefully shutting down...");
  try {
    await MongoDBClient.close();
    console.log("MongoDB connection closed");
    server.close(() => {
      console.log("HTTP server closed");
      process.exit(0);
    });
  } catch (err) {
    console.error(" Error during shutdown:", err);
    process.exit(1);
  }
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
