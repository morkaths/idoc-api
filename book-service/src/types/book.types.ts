export interface Category {
  _id: string;
  slug?: string;
  parentId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface CategoryTranslation {
  categoryId: string;
  lang: string;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Author {
  _id: string;
  name: string;
  avatarUrl?: string;
  birthDate?: Date;
  nationality?: string;
  bio?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Book {
  _id: string;
  title: string;
  subtitle?: string;
  description?: string;
  slug?: string;
  authorIds: string[];
  categoryIds: string[];
  publisher?: string;
  publishedDate?: Date;
  edition?: string;
  isbn?: string;
  language?: string;
  pages?: number;
  format?: string;
  price?: number;
  currency?: string;
  stock?: number;
  coverUrl?: string;
  tags?: string[];
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
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