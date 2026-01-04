import http from 'http';
import 'reflect-metadata';

import app from './app';
import { MongoDBClient } from '@libs/mongodb';
import { RedisClient } from '@libs/redis';
import { 
  PORT,
  BASE_URL,
  MONGODB_URI,
  REDIS_URI
} from './config/env.config';

const server = http.createServer(app);

// Kết nối đến MongoDB và Redis
Promise.all([
  MongoDBClient.connect(MONGODB_URI),
  RedisClient.connect(REDIS_URI),
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
