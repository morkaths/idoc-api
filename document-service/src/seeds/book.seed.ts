import { Author } from 'src/models/author.model';
import { Book } from '../models/book.model';
import { Category } from 'src/models/category.model';
import { BookFormat, FileType } from 'src/types';
import {
  randomItem,
  randomInt,
  randomBoolean,
  randomItems,
  randomDate,
  createSlug,
  generateISBN,
  randomImageUrl
} from '../utils/seed.util';

// Dữ liệu mock cụ thể cho books
const BOOK_TITLE_ADJECTIVES = [
  'Amazing', 'Wonderful', 'Great', 'Fantastic', 'Brilliant', 
  'Incredible', 'Spectacular', 'Marvelous', 'Extraordinary', 'Magnificent',
  'Captivating', 'Enchanting', 'Mysterious', 'Epic', 'Legendary'
];

const BOOK_TITLE_NOUNS = [
  'Adventure', 'Journey', 'Story', 'Tale', 'Legacy', 
  'Quest', 'Legend', 'Mystery', 'Odyssey', 'Saga',
  'Chronicle', 'Discovery', 'Revelation', 'Destiny', 'Horizon'
];

const PUBLISHERS = [
  'NXB Trẻ',
  'Bloomsbury',
  'Kodansha',
  'Editorial Sudamericana',
  'Penguin Random House',
  'HarperCollins',
  'Simon & Schuster',
  'Macmillan Publishers',
  'Hachette Livre',
  'Scholastic Corporation',
  'Oxford University Press',
  'Cambridge University Press'
];

const LANGUAGES = [
  'Vietnamese', 'English', 'Japanese', 'Spanish', 'French', 'German', 'Chinese', 'Korean', 'Portuguese', 'Russian'
];

const BOOK_SUBTITLES = [
  'A Journey Through Time',
  'The Complete Guide',
  'An Epic Story',
  'The Definitive Edition',
  'A Modern Classic',
  'The Essential Collection',
  'Volume One',
  'The First Chapter'
];

export async function seedBooks() {
  await Book.deleteMany({});

  const authors = await Author.find();
  const categories = await Category.find();

  // Kiểm tra có authors và categories không
  if (authors.length === 0) {
    console.warn('No authors found. Please seed authors first.');
    return;
  }
  if (categories.length === 0) {
    console.warn('No categories found. Please seed categories first.');
    return;
  }

  const mockBooks = [];
  const bookCount = 20; // Số lượng books
  const fileTypes = Object.values(FileType);
  const formats = Object.values(BookFormat);

  for (let i = 0; i < bookCount; i++) {
    // Random title
    const adjective = randomItem(BOOK_TITLE_ADJECTIVES);
    const noun = randomItem(BOOK_TITLE_NOUNS);
    const title = `${adjective} ${noun} ${i + 1}`;
    
    // Random các giá trị khác
    const subtitle = randomItem(BOOK_SUBTITLES);
    const slug = createSlug(title);
    const hasEbook = randomBoolean(); // Random có ebook hay không
    const randomAuthor = randomItem(authors);
    const randomCategories = randomItems(categories, 1, 2); // Random 1-2 categories
    const randomLanguage = randomItem(LANGUAGES);
    const randomPublisher = randomItem(PUBLISHERS);
    const randomFileType = randomItem(fileTypes);

    mockBooks.push({
      title,
      subtitle,
      description: `Description for ${title}. ${subtitle}. This is a randomly generated book for testing purposes.`,
      slug: `${slug}-${i + 1}`,
      authorIds: [randomAuthor?._id].filter(Boolean),
      categoryIds: randomCategories.map(c => c._id).filter(Boolean),
      publisher: randomPublisher,
      publishedDate: randomDate(1990, 2023),
      edition: randomInt(1, 5).toString(),
      isbn: generateISBN(),
      language: randomLanguage,
      pages: randomInt(100, 500),
      price: randomInt(1, 999),
      stock: randomInt(10, 100),
      coverUrl: randomImageUrl('covers', title),
      // Random ebook (có hoặc không)
      ...(hasEbook && {
        fileUrl: randomImageUrl('ebooks', title, randomFileType),
        fileType: randomFileType,
        fileSize: randomInt(1048576, 10485760), // Random 1MB-10MB
      }),
      tags: [`tag${i + 1}`, 'mock', 'test', randomCategories[0]?.slug].filter(Boolean)
    });
  }

  await Book.create(mockBooks);
  console.log(`Seed ${mockBooks.length} book(s) success!`);
}