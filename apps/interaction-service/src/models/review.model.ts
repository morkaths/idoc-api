import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  userId: string;
  itemId: string;
  rating: number;
  content?: string;
  isHidden: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    userId: { type: String, required: true, trim: true },
    itemId: { type: String, required: true, trim: true },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    content: {
      type: String,
      trim: true,
      maxlength: 2000
    },
    isHidden: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ReviewSchema.index({ userId: 1, itemId: 1 }, { unique: true });
ReviewSchema.index({ itemId: 1, isHidden: 1, createdAt: -1 });
ReviewSchema.index({ itemId: 1, isHidden: 1, rating: -1 });
ReviewSchema.index({ userId: 1, createdAt: -1 });

export const Review = mongoose.model<IReview>('Review', ReviewSchema);
