// ...existing code...
import { faker } from '@faker-js/faker';
import { Author } from 'src/models/author.model';
import { Book } from '../models/book.model';
import { Category } from 'src/models/category.model';

/**
 * Seed books using faker
 */
export async function seedBooks(countArg?: number) {
  const count = countArg || 20;

  // wipe books
  await Book.deleteMany({});

  const authors = await Author.find().lean();
  const categories = await Category.find().lean();

  if (!authors.length) {
    console.warn('No authors found. Please seed authors first.');
    return;
  }
  if (!categories.length) {
    console.warn('No categories found. Please seed categories first.');
    return;
  }

  const docs: any[] = [];
  for (let i = 0; i < count; i++) {
    const title = `${faker.word.adjective({ length: { min: 4, max: 10 } })} ${faker.word.noun()}`;
    const subtitle = faker.lorem.words({ min: 2, max: 6 });
    const slugBase = faker.helpers.slugify(`${title} ${i + 1}`).toLowerCase();
    const chosenAuthor = faker.helpers.arrayElement(authors);
    const chosenCategories = faker.helpers.arrayElements(categories, faker.number.int({ min: 1, max: Math.min(3, categories.length) }));
    const isbn = faker.string.numeric(13);
    const coverUrl = `https://picsum.photos/seed/${encodeURIComponent(slugBase)}/600/900`;
    
    docs.push({
      title,
      subtitle,
      description: faker.lorem.paragraphs({ min: 1, max: 3 }),
      slug: `${slugBase}-${i + 1}`,
      authorIds: [chosenAuthor._id].filter(Boolean),
      categoryIds: chosenCategories.map((c: any) => c._id).filter(Boolean),
      publisher: faker.company.name(),
      publishedDate: faker.date.between({ from: '1990-01-01', to: '2023-12-31' }),
      edition: String(faker.number.int({ min: 1, max: 10 })),
      isbn,
      language: faker.helpers.arrayElement(['Vietnamese', 'English', 'Japanese', 'Spanish', 'French']),
      pages: faker.number.int({ min: 80, max: 1200 }),
      price: faker.number.int({ min: 1, max: 999 }),
      stock: faker.number.int({ min: 0, max: 500 }),
      coverUrl,
      tags: [
        `tag-${i + 1}`,
        'mock',
        'seed',
        ...(chosenCategories[0]?.slug ? [chosenCategories[0].slug] : [])
      ].filter(Boolean),
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  if (docs.length) {
    await Book.insertMany(docs);
  }

  console.log(`Seeded ${docs.length} book(s).`);
}