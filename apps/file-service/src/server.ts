import http from 'http';
import 'reflect-metadata';
import 'multer';

import app from './app';
import { config } from '@libs/config';
import { MongoDBClient } from '@libs/mongodb';
import { RedisClient } from '@libs/redis';
import { MinioClient } from '@libs/minio';
import { logger } from '@libs/logger';

const server = http.createServer(app);

// Kết nối đến MongoDB, Minio
Promise.all([
  MongoDBClient.connect({ uri: config.services.file.db, logger }),
  RedisClient.connect({ url: config.redis.uri }),
  MinioClient.connect({
    endPoint: config.storage.minio.endPoint,
    port: config.storage.minio.port,
    useSSL: config.storage.minio.useSSL,
    accessKey: config.storage.minio.accessKey,
    secretKey: config.storage.minio.secretKey,
  }),
]).then(() => {
  server.listen(config.services.file.port, () => {
    console.log(`Server running on port ${config.services.file.port}`);
    console.log(`Server running on ${config.services.file.url}`);
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
