import { Category } from '../models/category.model';

export async function seedCategories() {
  await Category.deleteMany({});
  await Category.create([
    { slug: 'van-hoc', },
    { slug: 'kinh-te', },
    { slug: 'thieu-nhi', },
  ]);
  console.log('Seed category data success!');
}