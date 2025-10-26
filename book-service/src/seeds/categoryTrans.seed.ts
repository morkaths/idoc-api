import { CategoryTranslation } from '../models/categoryTranslation.model';
import mongoose from 'mongoose';

export async function seedCategoryTranslations() {
  await CategoryTranslation.deleteMany({});
  await CategoryTranslation.create([
    {
      categoryId: new mongoose.Types.ObjectId(), // Thay bằng _id thực tế
      lang: 'vi',
      name: 'Văn học',
      description: 'Sách văn học Việt Nam và thế giới'
    },
    {
      categoryId: new mongoose.Types.ObjectId(),
      lang: 'en',
      name: 'Literature',
      description: 'Vietnamese and world literature books'
    }
    // Thêm bản dịch khác nếu muốn
  ]);
  console.log('Seed category translation data success!');
}