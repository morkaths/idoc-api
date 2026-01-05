import mongoose from 'mongoose';
import { config } from '@libs/config';
import { seedProfiles } from './profile.seed';

async function seed() {
  try {
    await mongoose.connect(config.services.user.db);

    // Seed data
    await seedProfiles();

  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

seed();