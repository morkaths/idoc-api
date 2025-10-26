import { Book } from '../models/book.model';
import mongoose from 'mongoose';

export async function seedBooks() {
  await Book.deleteMany({});
  await Book.create([
    {
      slug: 'mat-biec',
      authorIds: [new mongoose.Types.ObjectId()], // Thay bằng _id thực tế
      categoryIds: [new mongoose.Types.ObjectId()],
      publisher: 'NXB Trẻ',
      publishedDate: new Date('1990-01-01'),
      edition: '1',
      isbn: '9786041123456',
      language: 'vi',
      pages: 300,
      format: 'HARDCOVER',
      price: 120000,
      currency: 'VND',
      stock: 100,
      coverUrl: 'https://example.com/covers/mat-biec.jpg'
    }
    // Thêm sách khác nếu muốn
  ]);
  console.log('Seed book data success!');
}