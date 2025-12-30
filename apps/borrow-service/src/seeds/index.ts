import mongoose from 'mongoose';
import { MONGODB_URI } from '../config/env.config';
import { seedBorrows } from './borrow.seed';

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);

    // Seed data
    await seedBorrows();
    

  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

seed();