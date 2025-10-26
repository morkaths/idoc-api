import { Author } from '../models/author.model';

export async function seedAuthors() {
  await Author.deleteMany({});
  await Author.create([
    {
      name: 'Nguyễn Nhật Ánh',
      nationality: 'Vietnamese',
      birthDate: new Date('1955-05-07'),
      avatarUrl: 'https://example.com/avatars/nguyen-nhat-anh.jpg'
    },
    {
      name: 'J.K. Rowling',
      nationality: 'British',
      birthDate: new Date('1965-07-31'),
      avatarUrl: 'https://example.com/avatars/jk-rowling.jpg'
    },
    {
      name: 'Haruki Murakami',
      nationality: 'Japanese',
      birthDate: new Date('1949-01-12'),
      avatarUrl: 'https://example.com/avatars/haruki-murakami.jpg'
    }
  ]);
  console.log('Seed author data success!');
}