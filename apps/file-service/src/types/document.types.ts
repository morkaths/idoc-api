import { FileType } from "./enum.types";

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
  price?: number;
  stock?: number;
  coverUrl?: string;
  fileUrl?: string; 
  fileType?: FileType;
  fileSize?: number;
  tags?: string[];
  updatedBy?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Document {
  _id: string;
  title: string;
  subtitle?: string;
  description?: string;
  categoryIds: string[];
  tags?: string[];
  language?: string;
  fileUrl?: string;
  fileType?: FileType;
  fileSize?: number;
  uploadedBy?: number;
  updatedBy?: number;
  createdAt?: Date;
  updatedAt?: Date;
}