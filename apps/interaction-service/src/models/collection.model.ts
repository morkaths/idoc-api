import { Schema, model, Document } from 'mongoose';

export interface ICollection extends Document {
  userId: string;
  name: string;
  description: string;
  itemCount: number;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CollectionSchema = new Schema<ICollection>(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, default: '', trim: true, maxlength: 500 },
    itemCount: { type: Number, default: 0, min: 0 },
    isPublic: { type: Boolean, default: false },
  },
  { timestamps: true }
);

CollectionSchema.index({ userId: 1, name: 1 }, { unique: true });
CollectionSchema.index({ userId: 1, createdAt: -1 });
CollectionSchema.index({ isPublic: 1, createdAt: -1 });
CollectionSchema.index({ itemCount: -1 });

export const Collection = model<ICollection>('Collection', CollectionSchema);
