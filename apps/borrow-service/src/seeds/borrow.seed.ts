import { Borrow } from '../models/borrow.model';
import { BookClient } from '../integrations/book.client';
import { UserClient } from '../integrations/user.client';

export async function seedBorrows() {

  // Xóa dữ liệu cũ
  await Borrow.deleteMany({});

  // Lấy danh sách user và book
  const users = await UserClient.find({ limit: 20 });
  const books = await BookClient.find({ limit: 20 });

  if (!users.length) {
    console.warn('No users found. Please seed users first.');
    return;
  }
  if (!books.length) {
    console.warn('No books found. Please seed books first.');
    return;
  }

  const docs: any[] = [];

  const mockUser = users.find(u => u.email === 'tranduyvuong2004@gmail.com');
  if (mockUser) {
    docs.push({
      userId: mockUser.id,
      itemId: books[0]._id,
      borrowTime: new Date(),
      expireTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
      status: 'active',
      note: 'This is a mock borrow record for testing purposes.',
      extendCount: 0,
    });
  }

  if (docs.length) {
    await Borrow.insertMany(docs);
  }

  console.log(`Seeded ${docs.length} borrow(s).`);
}