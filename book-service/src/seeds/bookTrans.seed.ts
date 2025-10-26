import { BookTranslation } from '../models/bookTranslation.model';
import mongoose from 'mongoose';

export async function seedBookTranslations() {
  await BookTranslation.deleteMany({});
  await BookTranslation.create([
    {
      bookId: new mongoose.Types.ObjectId(), // Thay bằng _id thực tế
      lang: 'vi',
      title: 'Mắt Biếc',
      subtitle: 'Tiểu thuyết nổi tiếng',
      description: 'Một câu chuyện cảm động về tuổi thơ và tình yêu.'
    },
    {
      bookId: new mongoose.Types.ObjectId(),
      lang: 'en',
      title: 'Blue Eyes',
      subtitle: 'Famous novel',
      description: 'A touching story about childhood and love.'
    }
    // Thêm bản dịch khác nếu muốn
  ]);
  console.log('Seed book translation data success!');
}