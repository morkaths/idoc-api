// ...existing code...
import { Author } from '../models/author.model';
import { faker } from '@faker-js/faker';

/**
 * Seed authors with fake data.
 * - Safe guard: won't run on production unless --force passed.
 * - Usage: called from seeds/index.ts or run directly with ts-node.
 */
export async function seedAuthors(countArg?: number) {
  const count = countArg || 20;
  const force = process.argv.includes('--force');

  if (process.env.NODE_ENV === 'production' && !force) {
    console.warn('Refusing to seed authors in production without --force');
    return;
  }

  // remove existing authors
  await Author.deleteMany({});

  const docs: any[] = [];
  for (let i = 0; i < count; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const name = `${firstName} ${lastName}`;
    const nationality = faker.location.country();
    const birthDate = faker.date.birthdate({ min: 1950, max: 2000, mode: 'year' });

    docs.push({
      name,
      nationality,
      birthDate,
      avatarUrl: faker.image.avatar(),
      bio: faker.lorem.paragraphs({ min: 1, max: 2 }),
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  if (docs.length > 0) {
    await Author.insertMany(docs);
  }

  console.log(`Seeded ${docs.length} author(s).`);
}