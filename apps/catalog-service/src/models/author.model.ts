import mongoose, { Schema, Document } from 'mongoose';

export interface IAuthor extends Document {
  name: string;
  avatarUrl?: string;
  birthDate?: Date;
  nationality?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const AuthorSchema = new Schema<IAuthor>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    avatarUrl: { type: String, trim: true },
    birthDate: { type: Date },
    nationality: { type: String, trim: true },
  },
  { timestamps: true }
);

AuthorSchema.index({ name: 'text' });
AuthorSchema.index({ name: 1 });

export const Author = mongoose.model<IAuthor>('Author', AuthorSchema);