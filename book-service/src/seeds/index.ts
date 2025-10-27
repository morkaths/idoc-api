import mongoose from 'mongoose';
import { MONGODB_URI } from '../config/env.config';
import { seedAuthors } from './author.seed';
import { seedCategories } from './category.seed';
import { seedBooks } from './book.seed';
import { seedCategoryTranslations } from './categoryTrans.seed';
import { seedBookTranslations } from './bookTrans.seed';
import { seedAuthorTranslations } from './authorTrans.seed';

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);

    // Seed data
    await seedAuthors();
    await seedCategories();
    await seedBooks();
    await seedCategoryTranslations();
    await seedBookTranslations();
    await seedAuthorTranslations();

  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

seed();

// npm run seed