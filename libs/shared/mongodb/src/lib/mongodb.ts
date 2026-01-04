import mongoose from 'mongoose';

export class MongoDBClient {
  static async connect(uri: string): Promise<void> {
    try {
      const conn = await mongoose.connect(uri);
      console.log(`MongoDB Shared Connected: ${conn.connection.host}`);
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

// Handle MongoDB connection events globally for the shared client usage
mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});
