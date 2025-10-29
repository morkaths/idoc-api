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
    name: { type: String, required: true, index:true, trim: true },
    avatarUrl: { type: String, trim: true },
    birthDate: { type: Date },
    nationality: { type: String, trim: true },
  },
  { timestamps: true }
);

export const Author = mongoose.model<IAuthor>('Author', AuthorSchema);