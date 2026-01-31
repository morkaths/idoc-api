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
  rating?: number;
  totalReviews?: number;
}

const BookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, trim: true },
    description: { type: String, trim: true },
    categoryIds: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    authorIds: [{ type: Schema.Types.ObjectId, ref: 'Author' }],
    publisher: { type: String, trim: true },
    publishedDate: { type: Date },
    edition: { type: String, trim: true },
    isbn: { type: String, trim: true },
    language: { type: String, trim: true },
    pages: { type: Number, min: 0 },
    price: { type: Number, min: 0 },
    stock: { type: Number, min: 0 },
    coverUrl: { type: String, trim: true },
    fileKey: { type: String, trim: true },
    tags: [{ type: String, trim: true }],
    updatedBy: { type: String, trim: true },
    rating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

BookSchema.index({ title: 'text', description: 'text' });
BookSchema.index({ slug: 1 }, { unique: true, sparse: true });
BookSchema.index({ isbn: 1 }, { unique: true, sparse: true });
BookSchema.index({ categoryIds: 1 });
BookSchema.index({ authorIds: 1 });
BookSchema.index({ tags: 1 });
BookSchema.index({ rating: -1 });
BookSchema.index({ createdAt: -1 });


export const Book = mongoose.model<IBook>('Book', BookSchema);