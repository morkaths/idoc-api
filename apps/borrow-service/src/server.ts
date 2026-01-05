import http from 'http';
import 'reflect-metadata';

import app from './app';
import { config } from '@libs/config';
import { MongoDBClient } from '@libs/mongodb';
import { RedisClient } from '@libs/redis';
import { logger } from '@libs/logger';
import { startAllJobs } from './jobs';

const server = http.createServer(app);

// Kết nối đến MongoDB
Promise.all([
  MongoDBClient.connect({ uri: config.services.borrow.db, logger }),
  RedisClient.connect({ url: config.redis.uri }),
]).then(() => {
  server.listen(config.services.borrow.port, () => {
    console.log(`Server running on port ${config.services.borrow.port}`);
    console.log(`Server running on ${config.services.borrow.url}`);
    startAllJobs();
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
