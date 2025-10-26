import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  slug?: string;
  parentId?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const CategorySchema: Schema = new Schema(
  {
    slug: { type: String, index: true },
    parentId: { type: Schema.Types.ObjectId, ref: 'Category' },
  },
  { timestamps: true }
);

export const Category = mongoose.model<ICategory>('Category', CategorySchema);