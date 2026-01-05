import mongoose from 'mongoose';
import { Logger } from 'winston';

export interface MongoConfig {
  uri: string;
  options?: mongoose.ConnectOptions;
  logger?: Logger;
}

export class MongoDBClient {
  static async connect(config: MongoConfig): Promise<void> {
    const logger = config.logger;
    try {
      const defaultOptions: mongoose.ConnectOptions = {
        maxPoolSize: 50, // Increase pool size for production
        minPoolSize: 10, // Maintain some ready connections
        serverSelectionTimeoutMS: 5000, // Fail fast
        socketTimeoutMS: 45000, // Close idle sockets
        autoIndex: process.env.NODE_ENV !== 'production', // Disable autoIndex in production
      };

      const finalOptions = { ...defaultOptions, ...config.options };

      mongoose.set('debug', (collectionName, method, query, doc) => {
        logger?.info({
          message: `${collectionName}.${method}`,
          context: 'MONGO',
          query,
          doc
        });
      });

      const conn = await mongoose.connect(config.uri, finalOptions);
      console.log(`[MongoDB] Connected: ${conn.connection.host}`);
    } catch (error) {
      console.error('[MongoDB] connection error:', error);
      if (process.env.NODE_ENV === 'production') {
        process.exit(1);
      } else {
        console.warn('[MongoDB] Running in development mode without database connection');
      }
    }
  }

  static async close(): Promise<void> {
    await mongoose.disconnect();
    console.log('[MongoDB] disconnected');
  }
}

// Handle MongoDB connection events globally for the shared client usage
mongoose.connection.on('error', (error) => {
  console.error('[MongoDB] connection error:', error);
});

mongoose.connection.on('disconnected', () => {
  console.log('[MongoDB] disconnected');
});
