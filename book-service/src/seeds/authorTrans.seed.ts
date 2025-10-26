import { AuthorTranslation } from '../models/authorTranslation.model';
import mongoose from 'mongoose';

export async function seedAuthorTranslations() {
  await AuthorTranslation.deleteMany({});
  await AuthorTranslation.create([
    {
      authorId: new mongoose.Types.ObjectId(), // Thay bằng _id thực tế
      lang: 'vi',
      bio: 'Nhà văn nổi tiếng với các tác phẩm thiếu nhi.'
    },
    {
      authorId: new mongoose.Types.ObjectId(),
      lang: 'en',
      bio: 'Famous writer for children\'s books.'
    }
    // Thêm bản dịch khác nếu muốn
  ]);
  console.log('Seed author translation data success!');
}