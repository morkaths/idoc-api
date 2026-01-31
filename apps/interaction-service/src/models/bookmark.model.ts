import { Schema, model, Document, Types } from 'mongoose';

export interface IBookmark extends Document {
  userId: string;
  itemId: string;
  collectionId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const BookmarkSchema = new Schema<IBookmark>(
  {
    userId: { type: String, required: true, trim: true },
    itemId: { type: String, required: true, trim: true },
    collectionId: { type: Schema.Types.ObjectId, ref: 'Collection' },
  },
  { timestamps: true }
);

BookmarkSchema.index({ userId: 1, collectionId: 1, itemId: 1 }, { unique: true });
BookmarkSchema.index({ collectionId: 1, createdAt: -1 });
BookmarkSchema.index({ userId: 1, itemId: 1 });
BookmarkSchema.index({ userId: 1, createdAt: -1 });
BookmarkSchema.index({ itemId: 1 });

export const Bookmark = model<IBookmark>('Bookmark', BookmarkSchema);
