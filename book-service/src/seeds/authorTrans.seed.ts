import { Author } from 'src/models/author.model';
import { AuthorTranslation } from '../models/authorTranslation.model';
import mongoose from 'mongoose';

export async function seedAuthorTranslations() {
  await AuthorTranslation.deleteMany({});

  const authors = await Author.find();
  const getAuthorId = (name: string) =>
    authors.find(a => a.name === name)?._id;

  await AuthorTranslation.create([
    // Nguyễn Nhật Ánh
    {
      authorId: getAuthorId('Nguyễn Nhật Ánh'),
      lang: 'vi',
      bio: 'Nhà văn nổi tiếng với các tác phẩm thiếu nhi.'
    },
    {
      authorId: getAuthorId('Nguyễn Nhật Ánh'),
      lang: 'en',
      bio: 'Famous Vietnamese children\'s book writer.'
    },
    {
      authorId: getAuthorId('Nguyễn Nhật Ánh'),
      lang: 'ja',
      bio: 'ベトナムの著名な児童文学作家。'
    },

    // J.K. Rowling
    {
      authorId: getAuthorId('J.K. Rowling'),
      lang: 'vi',
      bio: 'Tác giả người Anh, nổi tiếng với bộ truyện Harry Potter.'
    },
    {
      authorId: getAuthorId('J.K. Rowling'),
      lang: 'en',
      bio: 'British author, best known for the Harry Potter series.'
    },
    {
      authorId: getAuthorId('J.K. Rowling'),
      lang: 'ja',
      bio: 'イギリスの作家。ハリー・ポッターシリーズで有名。'
    },

    // Haruki Murakami
    {
      authorId: getAuthorId('Haruki Murakami'),
      lang: 'vi',
      bio: 'Tiểu thuyết gia nổi tiếng của Nhật Bản.'
    },
    {
      authorId: getAuthorId('Haruki Murakami'),
      lang: 'en',
      bio: 'Famous Japanese novelist.'
    },
    {
      authorId: getAuthorId('Haruki Murakami'),
      lang: 'ja',
      bio: '日本の小説家。代表作は「ノルウェイの森」など。'
    },

    // Isabel Allende
    {
      authorId: getAuthorId('Isabel Allende'),
      lang: 'vi',
      bio: 'Nhà văn nổi tiếng người Chile với các tiểu thuyết lịch sử.'
    },
    {
      authorId: getAuthorId('Isabel Allende'),
      lang: 'en',
      bio: 'Chilean writer, famous for her historical novels.'
    },
    {
      authorId: getAuthorId('Isabel Allende'),
      lang: 'ja',
      bio: 'チリの作家。歴史小説で有名。'
    },

    // Gabriel García Márquez
    {
      authorId: getAuthorId('Gabriel García Márquez'),
      lang: 'vi',
      bio: 'Nhà văn Colombia, tác giả của "Trăm năm cô đơn".'
    },
    {
      authorId: getAuthorId('Gabriel García Márquez'),
      lang: 'en',
      bio: 'Colombian writer, author of "One Hundred Years of Solitude".'
    },
    {
      authorId: getAuthorId('Gabriel García Márquez'),
      lang: 'ja',
      bio: 'コロンビアの作家。「百年の孤独」の著者。'
    },

    // George Orwell
    {
      authorId: getAuthorId('George Orwell'),
      lang: 'vi',
      bio: 'Tiểu thuyết gia người Anh, tác giả của "1984" và "Trại súc vật".'
    },
    {
      authorId: getAuthorId('George Orwell'),
      lang: 'en',
      bio: 'British novelist, author of "1984" and "Animal Farm".'
    },
    {
      authorId: getAuthorId('George Orwell'),
      lang: 'ja',
      bio: 'イギリスの小説家。「一九八四年」「動物農場」の著者。'
    }
  ].filter(t => t.authorId));

  console.log('Seed author translation data success!');
}