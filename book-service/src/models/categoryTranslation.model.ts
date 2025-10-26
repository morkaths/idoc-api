import mongoose, { Schema, Document } from 'mongoose';

export interface ICategoryTranslation extends Document {
  categoryId: mongoose.Types.ObjectId;
  lang: string;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const CategoryTranslationSchema: Schema = new Schema(
  {
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    lang: { type: String, required: true, index: true },
    name: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

export const CategoryTranslation = mongoose.model<ICategoryTranslation>('CategoryTranslation', CategoryTranslationSchema);