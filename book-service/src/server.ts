import http from 'http';
import mongoose from 'mongoose';

import app from './app';
import { connectDB } from './config/database.config';
import { PORT, BASE_URL } from './config/env.config';

const server = http.createServer(app);

// Kết nối đến MongoDB
connectDB().then(() => {
  server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Server running on ${BASE_URL}`);
  });
});

// Xử lý tắt server và đóng kết nối
const gracefulShutdown = async () => {
  console.log("\n Gracefully shutting down...");
  try {
      await mongoose.connection.close();
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
