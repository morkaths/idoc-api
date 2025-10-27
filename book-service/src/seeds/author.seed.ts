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
    },
    {
      name: 'Isabel Allende',
      nationality: 'Chilean',
      birthDate: new Date('1942-08-02'),
      avatarUrl: 'https://example.com/avatars/isabel-allende.jpg'
    },
    {
      name: 'Gabriel García Márquez',
      nationality: 'Colombian',
      birthDate: new Date('1927-03-06'),
      avatarUrl: 'https://example.com/avatars/gabriel-garcia-marquez.jpg'
    },
    {
      name: 'George Orwell',
      nationality: 'British',
      birthDate: new Date('1903-06-25'),
      avatarUrl: 'https://example.com/avatars/george-orwell.jpg'
    }
  ]);
  console.log('Seed author data success!');
}