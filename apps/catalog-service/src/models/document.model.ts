// ...existing code...
import mongoose, { Schema, Document as MongooseDocument } from 'mongoose';

export interface IDocument extends MongooseDocument {
  title: string;
  slug?: string;
  description?: string;
  categoryIds: mongoose.Types.ObjectId[];
  language?: string;
  kind: string; // e.g., 'pdf', 'epub', 'audiobook'
  coverUrl?: string;
  fileIds: string[]; // Array of file URLs or IDs
  metadata?: any;
  access?: string; // e.g., 'free', 'premium', 'restricted'
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const DocumentSchema = new Schema<IDocument>(
  {
    title: { type: String, required: true, index: true, trim: true },
    slug: { type: String, index: true, trim: true },
    description: { type: String, trim: true },
    categoryIds: [{ type: Schema.Types.ObjectId, ref: 'Category', index: true }],
    language: { type: String, trim: true },
    kind: { type: String, required: true, trim: true },
    coverUrl: { type: String, trim: true },
    fileIds: [{ type: String, required: true }],
    metadata: { type: Schema.Types.Mixed },
    access: { type: String, trim: true },
    updatedBy: { type: String, trim: true },
  },
  { timestamps: true }
);

export const Document = mongoose.model<IDocument>('Document', DocumentSchema);