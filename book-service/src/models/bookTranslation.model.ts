import mongoose, { Schema, Document } from 'mongoose';

export interface IBookTranslation extends Document {
  bookId: mongoose.Types.ObjectId;
  lang: string;
  title: string;
  subtitle?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const BookTranslationSchema: Schema = new Schema(
  {
    bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true, index: true },
    lang: { type: String, required: true, index: true },
    title: { type: String, required: true },
    subtitle: { type: String },
    description: { type: String },
  },
  { timestamps: true }
);

export const BookTranslation = mongoose.model<IBookTranslation>('BookTranslation', BookTranslationSchema);