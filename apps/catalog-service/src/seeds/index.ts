import mongoose from 'mongoose';
import { config } from '@libs/config';
import { seedAuthors } from './author.seed';
import { seedCategories } from './category.seed';
import { seedBooks } from './book.seed';
import { seedCategoryTranslations } from './categoryTrans.seed';

async function seed() {
  try {
    await mongoose.connect(config.services.catalog.db);

    // Seed data
    await seedAuthors();
    await seedCategories();
    await seedBooks();
    await seedCategoryTranslations();

  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

seed();

// npm run seed