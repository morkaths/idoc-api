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
      trim: true,
      required: true
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'Category'
    },
  },
  { timestamps: true }
);

CategorySchema.index({ slug: 1 }, { unique: true, sparse: true });
CategorySchema.index({ parentId: 1 });
CategorySchema.index({ parentId: 1, slug: 1 });

export const Category = mongoose.model<ICategory>('Category', CategorySchema);