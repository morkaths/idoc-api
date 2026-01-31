import mongoose, { Schema, Document as MongooseDocument } from 'mongoose';

export interface IDocument extends MongooseDocument {
  title: string;
  slug?: string;
  description?: string;
  categoryIds: mongoose.Types.ObjectId[];
  language?: string;
  kind: string;
  coverUrl?: string;
  fileIds: string[];
  metadata?: any;
  access?: string;
  averageRating?: number;
  reviewCount?: number;
  downloadCount?: number;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const DocumentSchema = new Schema<IDocument>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, trim: true },
    description: { type: String, trim: true },
    categoryIds: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    language: { type: String, trim: true },
    kind: { type: String, required: true, trim: true },
    coverUrl: { type: String, trim: true },
    fileIds: [{ type: String, required: true }],
    metadata: { type: Schema.Types.Mixed },
    access: { type: String, trim: true, enum: ['public', 'private', 'restricted'], default: 'public' },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
    downloadCount: { type: Number, default: 0, min: 0 },
    updatedBy: { type: String, trim: true },
  },
  { timestamps: true }
);

DocumentSchema.index({ title: 'text' });
DocumentSchema.index({ slug: 1 }, { unique: true, sparse: true });
DocumentSchema.index({ categoryIds: 1 });
DocumentSchema.index({ averageRating: -1 });
DocumentSchema.index({ kind: 1 });
DocumentSchema.index({ createdAt: -1 });

export const Document = mongoose.model<IDocument>('Document', DocumentSchema);