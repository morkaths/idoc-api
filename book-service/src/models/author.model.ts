import mongoose, { Schema, Document } from 'mongoose';

export interface IAuthor extends Document {
  name: string;
  avatarUrl?: string;
  birthDate?: Date;
  nationality?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const AuthorSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    avatarUrl: { type: String },
    birthDate: { type: Date },
    nationality: { type: String },
  },
  { timestamps: true }
);

export const Author = mongoose.model<IAuthor>('Author', AuthorSchema);