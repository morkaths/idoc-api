import mongoose, { Schema, Document } from 'mongoose';

export interface IDeck extends Document {
  title: string;
  thumbnail?: string;
  description?: string;
  termLang?: string;
  definitionLang?: string;
  tags?: string[];
  visibility?: 'public' | 'private' | 'unlisted';
  stats?: {
    totalFlashcards: number;
    totalStudied: number;
    totalFavorites: number;
  };
  createdBy?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const DeckSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    thumbnail: { type: String },
    description: { type: String },
    termLang: { type: String },
    definitionLang: { type: String },
    tags: [{ type: String }],
    visibility: { type: String, enum: ['public', 'private', 'unlisted'], default: 'private' },
    stats: {
      totalFlashcards: { type: Number, default: 0 },
      totalStudied: { type: Number, default: 0 },
      totalFavorites: { type: Number, default: 0 },
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const Deck = mongoose.model<IDeck>('Deck', DeckSchema);