import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  slug: string;
  parentId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    slug: { 
      type: String, 
      index: true, 
      trim: true,
      unique: true,
      required: true,
      sparse: true
    },
    parentId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Category',
      index: true
    },
  },
  { timestamps: true }
);

CategorySchema.index({ parentId: 1, slug: 1 });

export const Category = mongoose.model<ICategory>('Category', CategorySchema);