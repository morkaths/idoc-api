import { Author } from '../models/author.model';
import { randomItem, randomDate, randomImageUrl, createSlug } from '../utils/seed.util';

// Dữ liệu mock cụ thể cho authors
const FIRST_NAMES = [
  'Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ',
  'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý',
  'John', 'James', 'Mary', 'William', 'Robert', 'Patricia',
  'Michael', 'Jennifer', 'David', 'Lisa', 'Haruki', 'Yuki',
  'Gabriel', 'Carlos', 'Maria', 'Juan', 'Ana', 'Pedro'
];

const LAST_NAMES = [
  'Ánh', 'Văn', 'Thị', 'Minh', 'Anh', 'Quang', 'Hùng', 'Dũng', 'Linh',
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
  'Murakami', 'Tanaka', 'Suzuki', 'Yamamoto', 'Watanabe', 'Ito',
  'García', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez'
];

const NATIONALITIES = [
  'Vietnamese', 'American', 'British', 'Japanese', 'French', 'German',
  'Spanish', 'Italian', 'Chinese', 'Korean', 'Thai', 'Brazilian',
  'Australian', 'Canadian', 'Mexican', 'Indian', 'Russian', 'Swedish'
];

export async function seedAuthors() {
  await Author.deleteMany({});
  
  const mockAuthors = [];
  const authorCount = 10;
  
  for (let i = 0; i < authorCount; i++) {
    const firstName = randomItem(FIRST_NAMES);
    const lastName = randomItem(LAST_NAMES);
    const name = `${firstName} ${lastName}`;
    const nationality = randomItem(NATIONALITIES);
    const birthDate = randomDate(1950, 2000);
    
    mockAuthors.push({
      name,
      nationality,
      birthDate,
      avatarUrl: randomImageUrl('avatars', name)
    });
  }
  
  await Author.create(mockAuthors);
  console.log(`Seed ${mockAuthors.length} author(s) success!`);
}