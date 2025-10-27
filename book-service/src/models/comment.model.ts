import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  bookId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  content: string;
  rating?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const CommentSchema: Schema = new Schema(
  {
    bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5 },
  },
  { timestamps: true }
);

export const Comment = mongoose.model<IComment>('Comment', CommentSchema);