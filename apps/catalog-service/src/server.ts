import http from 'http';
import 'reflect-metadata';

import app from './app';
import { MongoDBClient } from '@libs/mongodb';
import { RedisClient } from '@libs/redis';
import { config } from '@libs/config';
import { logger } from '@libs/logger';

const server = http.createServer(app);

// Kết nối đến MongoDB và Redis
Promise.all([
  MongoDBClient.connect({ uri: config.services.catalog.db, logger }),
  RedisClient.connect({ url: config.redis.uri }),
]).then(() => {
  server.listen(config.services.catalog.port, () => {
    console.log(`Server running on port ${config.services.catalog.port}`);
    console.log(`Server running on ${config.services.catalog.url}`);
  });
});

// Xử lý tắt server và đóng kết nối
const gracefulShutdown = async () => {
  console.log("\n Gracefully shutting down...");
  try {
    await Promise.all([
      MongoDBClient.close(),
      RedisClient.disconnect(),
    ]);
    console.log("Database connections closed");

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
