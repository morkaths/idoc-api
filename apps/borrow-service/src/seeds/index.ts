import mongoose from 'mongoose';
import { config } from '@libs/config';
import { seedBorrows } from './borrow.seed';

async function seed() {
  try {
    await mongoose.connect(config.services.borrow.db);

    // Seed data
    await seedBorrows();
    

  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

seed();