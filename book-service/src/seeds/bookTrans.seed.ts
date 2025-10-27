import { Book } from 'src/models/book.model';
import { BookTranslation } from '../models/bookTranslation.model';
import mongoose from 'mongoose';

export async function seedBookTranslations() {
  await BookTranslation.deleteMany({});

  const books = await Book.find();

  const getBookId = (slug: string) =>
    books.find(b => b.slug === slug)?._id;

  await BookTranslation.create([
    // Mắt Biếc
    {
      bookId: getBookId('mat-biec'),
      lang: 'vi',
      title: 'Mắt Biếc',
      subtitle: 'Tiểu thuyết nổi tiếng',
      description: 'Một câu chuyện cảm động về tuổi thơ và tình yêu.'
    },
    {
      bookId: getBookId('mat-biec'),
      lang: 'en',
      title: 'Blue Eyes',
      subtitle: 'Famous novel',
      description: 'A touching story about childhood and love.'
    },
    {
      bookId: getBookId('mat-biec'),
      lang: 'ja',
      title: 'ブルーアイズ',
      subtitle: '有名な小説',
      description: '子供時代と愛についての感動的な物語。'
    },

    // Harry Potter 1
    {
      bookId: getBookId('harry-potter-1'),
      lang: 'vi',
      title: 'Harry Potter và Hòn đá Phù thủy',
      subtitle: 'Tập 1',
      description: 'Cuốn đầu tiên trong bộ truyện Harry Potter.'
    },
    {
      bookId: getBookId('harry-potter-1'),
      lang: 'en',
      title: 'Harry Potter and the Philosopher\'s Stone',
      subtitle: 'Book 1',
      description: 'The first book in the Harry Potter series.'
    },
    {
      bookId: getBookId('harry-potter-1'),
      lang: 'ja',
      title: 'ハリー・ポッターと賢者の石',
      subtitle: '第1巻',
      description: 'ハリー・ポッターシリーズの最初の本。'
    },

    // Norwegian Wood
    {
      bookId: getBookId('norwegian-wood'),
      lang: 'vi',
      title: 'Rừng Na Uy',
      subtitle: 'Tác phẩm nổi tiếng của Murakami',
      description: 'Một câu chuyện cảm động về tuổi trẻ và tình yêu.'
    },
    {
      bookId: getBookId('norwegian-wood'),
      lang: 'en',
      title: 'Norwegian Wood',
      subtitle: 'Murakami\'s masterpiece',
      description: 'A touching story about youth and love.'
    },
    {
      bookId: getBookId('norwegian-wood'),
      lang: 'ja',
      title: 'ノルウェイの森',
      subtitle: '村上春樹の代表作',
      description: '青春と恋愛を描いた感動的な物語。'
    },

    // Cien años de soledad
    {
      bookId: getBookId('cien-anos-de-soledad'),
      lang: 'vi',
      title: 'Trăm năm cô đơn',
      subtitle: 'Tiểu thuyết nổi tiếng',
      description: 'Kiệt tác của Gabriel García Márquez.'
    },
    {
      bookId: getBookId('cien-anos-de-soledad'),
      lang: 'en',
      title: 'One Hundred Years of Solitude',
      subtitle: 'Famous novel',
      description: 'The masterpiece of Gabriel García Márquez.'
    },
    {
      bookId: getBookId('cien-anos-de-soledad'),
      lang: 'ja',
      title: '百年の孤独',
      subtitle: '有名な小説',
      description: 'ガブリエル・ガルシア＝マルケスの傑作。'
    },

    // 1984
    {
      bookId: getBookId('1984'),
      lang: 'vi',
      title: '1984',
      subtitle: 'Tiểu thuyết phản địa đàng',
      description: 'Lời tiên tri lạnh lùng về tương lai.'
    },
    {
      bookId: getBookId('1984'),
      lang: 'en',
      title: '1984',
      subtitle: 'Dystopian classic',
      description: 'A chilling prophecy about the future.'
    },
    {
      bookId: getBookId('1984'),
      lang: 'ja',
      title: '一九八四年',
      subtitle: 'ディストピア小説',
      description: '未来についての冷たい予言。'
    }
  ].filter(t => t.bookId));

  console.log('Seed book translation data success!');
}