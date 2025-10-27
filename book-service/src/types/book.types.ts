
export interface Category {
  _id: string;
  slug?: string;
  parentId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Author {
  _id: string;
  name: string;
  avatarUrl?: string;
  birthDate?: Date;
  nationality?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Book {
  _id: string;
  slug?: string;
  authorIds: string[];
  categoryIds: string[];
  publisher?: string;
  publishedDate?: Date;
  edition?: string;
  isbn?: string;
  language?: string; // ngôn ngữ gốc
  pages?: number;
  format?: string; // e.g., Hardcover, Paperback, eBook, Audiobook
  price?: number;
  currency?: string; // e.g., USD, EUR
  stock?: number;
  coverUrl?: string;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  updatedBy?: string;
}

export interface BaseTranslation {
  lang: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CategoryTranslation extends BaseTranslation {
  categoryId: string;
  name: string;
  description?: string;
}

export interface AuthorTranslation extends BaseTranslation {
  authorId: string;
  bio?: string;
}

export interface BookTranslation extends BaseTranslation {
  bookId: string;
  title: string;
  subtitle?: string;
  description?: string;
}

export interface Comment {
  _id: string;
  bookId: string;
  userId: string;
  content: string;
  rating?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
