import mongoose from 'mongoose';
import { MONGODB_URI } from './env.config';

class MongoDBClient {
  static async connect(): Promise<void> {
    try {
      const conn = await mongoose.connect(MONGODB_URI);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.error('MongoDB connection error:', error);
      if (process.env.NODE_ENV === 'production') {
        process.exit(1);
      } else {
        console.warn('Running in development mode without database connection');
      }
    }
  }

  static async close(): Promise<void> {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
}

mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

export default MongoDBClient;