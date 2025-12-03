import { Category } from 'src/models/category.model';
import { CategoryTranslation } from '../models/category-translation.model';

export async function seedCategoryTranslations() {
  await CategoryTranslation.deleteMany({});

  const categories = await Category.find();
  const getCategoryId = (slug: string) =>
    categories.find(c => c.slug === slug)?._id;

  await CategoryTranslation.create([
    // Literature
    {
      categoryId: getCategoryId('literature'),
      lang: 'vi',
      name: 'Văn học',
      description: 'Sách văn học Việt Nam và thế giới'
    },
    {
      categoryId: getCategoryId('literature'),
      lang: 'en',
      name: 'Literature',
      description: 'Vietnamese and world literature books'
    },
    {
      categoryId: getCategoryId('literature'),
      lang: 'ja',
      name: '文学',
      description: 'ベトナムと世界の文学書'
    },

    // Economics
    {
      categoryId: getCategoryId('economics'),
      lang: 'vi',
      name: 'Kinh tế',
      description: 'Sách về kinh tế, quản lý, tài chính'
    },
    {
      categoryId: getCategoryId('economics'),
      lang: 'en',
      name: 'Economics',
      description: 'Books about economics, management, finance'
    },
    {
      categoryId: getCategoryId('economics'),
      lang: 'ja',
      name: '経済学',
      description: '経済、経営、金融に関する書籍'
    },

    // Children
    {
      categoryId: getCategoryId('children'),
      lang: 'vi',
      name: 'Thiếu nhi',
      description: 'Sách dành cho trẻ em'
    },
    {
      categoryId: getCategoryId('children'),
      lang: 'en',
      name: 'Children',
      description: 'Books for children'
    },
    {
      categoryId: getCategoryId('children'),
      lang: 'ja',
      name: '児童書',
      description: '子供向けの本'
    },

    // Novel
    {
      categoryId: getCategoryId('novel'),
      lang: 'vi',
      name: 'Tiểu thuyết',
      description: 'Sách tiểu thuyết các thể loại'
    },
    {
      categoryId: getCategoryId('novel'),
      lang: 'en',
      name: 'Novel',
      description: 'Novels of various genres'
    },
    {
      categoryId: getCategoryId('novel'),
      lang: 'ja',
      name: '小説',
      description: '様々なジャンルの小説'
    },

    // Fantasy
    {
      categoryId: getCategoryId('fantasy'),
      lang: 'vi',
      name: 'Giả tưởng',
      description: 'Sách thể loại giả tưởng'
    },
    {
      categoryId: getCategoryId('fantasy'),
      lang: 'en',
      name: 'Fantasy',
      description: 'Fantasy genre books'
    },
    {
      categoryId: getCategoryId('fantasy'),
      lang: 'ja',
      name: 'ファンタジー',
      description: 'ファンタジージャンルの書籍'
    },

    // Dystopia
    {
      categoryId: getCategoryId('dystopia'),
      lang: 'vi',
      name: 'Phản địa đàng',
      description: 'Sách thể loại phản địa đàng'
    },
    {
      categoryId: getCategoryId('dystopia'),
      lang: 'en',
      name: 'Dystopia',
      description: 'Dystopian genre books'
    },
    {
      categoryId: getCategoryId('dystopia'),
      lang: 'ja',
      name: 'ディストピア',
      description: 'ディストピアジャンルの書籍'
    }
  ].filter(t => t.categoryId));

  console.log('Seed category translation data success!');
}