import mongoose, { Schema, Document } from 'mongoose';

export interface IAuthorTranslation extends Document {
  authorId: mongoose.Types.ObjectId;
  lang: string;
  bio?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const AuthorTranslationSchema: Schema = new Schema(
  {
    authorId: { type: Schema.Types.ObjectId, ref: 'Author', required: true, index: true },
    lang: { type: String, required: true, index: true },
    bio: { type: String },
  },
  { timestamps: true }
);

export const AuthorTranslation = mongoose.model<IAuthorTranslation>('AuthorTranslation', AuthorTranslationSchema);