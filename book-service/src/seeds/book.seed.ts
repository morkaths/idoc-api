import { Author } from 'src/models/author.model';
import { Book } from '../models/book.model';
import { Category } from 'src/models/category.model';

export async function seedBooks() {
  await Book.deleteMany({});

  const authors = await Author.find();
  const categories = await Category.find();

  const getAuthorId = (name: string) =>
    authors.find(a => a.name === name)?._id;

  const getCategoryId = (slug: string) =>
    categories.find(c => c.slug === slug)?._id;

  await Book.create([
    {
      title: 'Mắt Biếc',
      subtitle: 'Tiểu thuyết nổi tiếng',
      description: 'Tác phẩm của Nguyễn Nhật Ánh về tuổi thơ và tình yêu.',
      slug: 'mat-biec',
      authorIds: [getAuthorId('Nguyễn Nhật Ánh')].filter(Boolean),
      categoryIds: [getCategoryId('novel')].filter(Boolean),
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
      coverUrl: 'https://example.com/covers/mat-biec.jpg',
      tags: ['tuổi thơ', 'tình yêu', 'văn học', 'nguyễn nhật ánh', 'mat biec']
    },
    {
      title: 'Harry Potter and the Philosopher\'s Stone',
      subtitle: 'Harry Potter #1',
      description: 'Cuốn đầu tiên trong bộ truyện Harry Potter.',
      slug: 'harry-potter-1',
      authorIds: [getAuthorId('J.K. Rowling')].filter(Boolean),
      categoryIds: [getCategoryId('fantasy')].filter(Boolean),
      publisher: 'Bloomsbury',
      publishedDate: new Date('1997-06-26'),
      edition: '1',
      isbn: '9780747532699',
      language: 'en',
      pages: 223,
      format: 'HARDCOVER',
      price: 250000,
      currency: 'VND',
      stock: 50,
      coverUrl: 'https://example.com/covers/harry-potter-1.jpg',
      tags: ['magic', 'wizard', 'fantasy', 'harry potter', 'j.k. rowling']
    },
    {
      title: 'Norwegian Wood',
      subtitle: 'Rừng Na Uy',
      description: 'Tiểu thuyết nổi tiếng của Haruki Murakami.',
      slug: 'norwegian-wood',
      authorIds: [getAuthorId('Haruki Murakami')].filter(Boolean),
      categoryIds: [getCategoryId('novel')].filter(Boolean),
      publisher: 'Kodansha',
      publishedDate: new Date('1987-09-04'),
      edition: '1',
      isbn: '9784061860257',
      language: 'ja',
      pages: 296,
      format: 'PAPERBACK',
      price: 180000,
      currency: 'VND',
      stock: 30,
      coverUrl: 'https://example.com/covers/norwegian-wood.jpg',
      tags: ['murakami', 'rừng na uy', 'norwegian wood', 'tiểu thuyết nhật', 'tình yêu']
    },
    {
      title: 'Cien años de soledad',
      subtitle: 'Trăm năm cô đơn',
      description: 'Tác phẩm nổi tiếng của Gabriel García Márquez.',
      slug: 'cien-anos-de-soledad',
      authorIds: [getAuthorId('Gabriel García Márquez')].filter(Boolean),
      categoryIds: [getCategoryId('novel')].filter(Boolean),
      publisher: 'Editorial Sudamericana',
      publishedDate: new Date('1967-05-30'),
      edition: '1',
      isbn: '9789500728677',
      language: 'es',
      pages: 417,
      format: 'HARDCOVER',
      price: 220000,
      currency: 'VND',
      stock: 20,
      coverUrl: 'https://example.com/covers/cien-anos-de-soledad.jpg',
      tags: ['marquez', 'trăm năm cô đơn', 'cien años de soledad', 'tiểu thuyết', 'colombia']
    },
    {
      title: '1984',
      subtitle: 'Nineteen Eighty-Four',
      description: 'Tiểu thuyết phản địa đàng của George Orwell.',
      slug: '1984',
      authorIds: [getAuthorId('George Orwell')].filter(Boolean),
      categoryIds: [getCategoryId('dystopia')].filter(Boolean),
      publisher: 'Secker & Warburg',
      publishedDate: new Date('1949-06-08'),
      edition: '1',
      isbn: '9780451524935',
      language: 'en',
      pages: 328,
      format: 'PAPERBACK',
      price: 150000,
      currency: 'VND',
      stock: 40,
      coverUrl: 'https://example.com/covers/1984.jpg',
      tags: ['orwell', '1984', 'dystopia', 'phản địa đàng', 'classic']
    }
  ]);
  console.log('Seed book data success!');
}