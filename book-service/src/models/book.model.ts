import mongoose, { Schema, Document } from 'mongoose';

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
  format?: string;
  price?: number;
  currency?: string;
  stock?: number;
  coverUrl?: string;
  tags?: string[];
  updatedBy?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const BookSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    description: { type: String },
    slug: { type: String, index: true },
    authorIds: [{ type: Schema.Types.ObjectId, ref: 'Author' }],
    categoryIds: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    publisher: { type: String },
    publishedDate: { type: Date },
    edition: { type: String },
    isbn: { type: String, index: true },
    language: { type: String },
    pages: { type: Number },
    format: { type: String },
    price: { type: Number },
    currency: { type: String },
    stock: { type: Number },
    coverUrl: { type: String },
    tags: [{ type: String, index: true }],
    updatedBy: { type: Number },
  },
  { timestamps: true }
);

export const Book = mongoose.model<IBook>('Book', BookSchema);