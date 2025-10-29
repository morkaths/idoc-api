import mongoose, { Schema, Document } from 'mongoose';

export interface ICategoryTranslation extends Document {
  categoryId: mongoose.Types.ObjectId;
  lang: string;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const CategoryTranslationSchema = new Schema<ICategoryTranslation>(
  {
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    lang: { type: String, required: true, index: true, trim: true },
    name: { type: String, required: true, trim: true },
    description: { type: String },
  },
  { timestamps: true }
);

export const CategoryTranslation = mongoose.model<ICategoryTranslation>('CategoryTranslation', CategoryTranslationSchema);