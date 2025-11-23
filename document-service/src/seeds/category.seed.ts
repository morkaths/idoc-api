import { Category } from '../models/category.model';

export async function seedCategories() {
  await Category.deleteMany({});
  await Category.create([
    { slug: 'literature' },
    { slug: 'economics' },
    { slug: 'children' },
    { slug: 'novel' },
    { slug: 'fantasy' },
    { slug: 'dystopia' }
  ]);
  console.log('Seed category data success!');
}