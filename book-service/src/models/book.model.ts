import mongoose, { Schema, Document } from 'mongoose';

export interface IBook extends Document {
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
  createdAt?: Date;
  updatedAt?: Date;
  updatedBy?: mongoose.Types.ObjectId;
}

const BookSchema: Schema = new Schema(
  {
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
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const Book = mongoose.model<IBook>('Book', BookSchema);