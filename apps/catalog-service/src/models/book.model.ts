import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IBook extends Document {
  title: string;
  slug?: string;
  description?: string;
  categoryIds: Types.ObjectId[];
  authorIds: Types.ObjectId[];
  publisher?: string;
  publishedDate?: Date;
  edition?: string;
  isbn?: string;
  language?: string;
  pages?: number;
  price?: number;
  stock?: number;
  coverUrl?: string;
  fileKey?: string;
  tags?: string[];
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const BookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true, index: true, trim: true },
    slug: { type: String, index: true, trim: true },
    description: { type: String, trim: true },
    categoryIds: [{ type: Schema.Types.ObjectId, ref: 'Category', index: true }],
    authorIds: [{ type: Schema.Types.ObjectId, ref: 'Author', index: true }],
    publisher: { type: String, trim: true },
    publishedDate: { type: Date },
    edition: { type: String, trim: true },
    isbn: { type: String, index: true, trim: true },
    language: { type: String, trim: true },
    pages: { type: Number, min: 0 },
    price: { type: Number, min: 0 },
    stock: { type: Number, min: 0 },
    coverUrl: { type: String, trim: true },
    fileKey: { type: String, trim: true },
    tags: [{ type: String, index: true, trim: true }],
    updatedBy: { type: String, trim: true },
  },
  { timestamps: true }
);

export const Book = mongoose.model<IBook>('Book', BookSchema);