// ...existing code...
import mongoose, { Schema, Document } from 'mongoose';

export interface IFile extends Document {
  title: string;
  slug?: string;
  description?: string;
  categoryIds: mongoose.Types.ObjectId[];
  language?: string;
  kind: string; // e.g., 'pdf', 'epub', 'audiobook'
  coverUrl?: string;
  fileUrls?: string[];
  metadata?: any;
  access?: string; // e.g., 'free', 'premium', 'restricted'
  updatedBy?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const FileSchema = new Schema<IFile>(
  {
    title: { type: String, required: true, index: true, trim: true },
    slug: { type: String, index: true, trim: true },
    description: { type: String, trim: true },
    categoryIds: [{ type: Schema.Types.ObjectId, ref: 'Category', index: true }],
    language: { type: String, trim: true },
    kind: { type: String, required: true, trim: true },
    coverUrl: { type: String, trim: true },
    fileUrls: [{ type: String, trim: true }],
    metadata: { type: Schema.Types.Mixed },
    access: { type: String, trim: true },
    updatedBy: { type: Number },
  },
  { timestamps: true }
);

export const File = mongoose.model<IFile>('File', FileSchema);