import mongoose, { Schema, Document } from 'mongoose';
import { FileType } from '../types';

export interface IBook extends Document {
  title: string;
  subtitle?: string;
  description?: string;
  slug?: string;
  authorIds: mongoose.Types.ObjectId[];
  categoryIds: mongoose.Types.ObjectId[];
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

const BookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true, index: true, trim: true },
    subtitle: { type: String, trim: true },
    description: { type: String, trim: true },
    slug: { type: String, index: true, trim: true },
    authorIds: [{ type: Schema.Types.ObjectId, ref: 'Author', index: true }],
    categoryIds: [{ type: Schema.Types.ObjectId, ref: 'Category', index: true }],
    publisher: { type: String, trim: true },
    publishedDate: { type: Date },
    edition: { type: String, trim: true },
    isbn: { type: String, index: true, trim: true },
    language: { type: String, trim: true },
    pages: { type: Number, min: 0 },
    price: { type: Number, min: 0 },
    stock: { type: Number, min: 0 },
    coverUrl: { type: String, trim: true },
    fileUrl: { type: String, trim: true },
    fileType: {
      type: String,
      enum: Object.values(FileType),
      trim: true,
      lowercase: true
    },
    fileSize: { type: Number, min: 0 },
    tags: [{ type: String, index: true, trim: true }],
    updatedBy: { type: Number },
  },
  { timestamps: true }
);

export const Book = mongoose.model<IBook>('Book', BookSchema);