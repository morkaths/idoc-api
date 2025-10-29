import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  slug?: string;
  parentId?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    slug: { type: String, index: true, trim: true },
    parentId: { type: Schema.Types.ObjectId, ref: 'Category' },
  },
  { timestamps: true }
);

export const Category = mongoose.model<ICategory>('Category', CategorySchema);