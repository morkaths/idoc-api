import mongoose from 'mongoose';
import { MONGODB_URI } from '../config/env.config';

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);

    // Seed data
    

  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

seed();

// npm run seed