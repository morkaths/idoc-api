import mongoose, { Schema, Document } from 'mongoose';

export interface ILanguage extends Document {
  code: string;
  name: string;
  nativeName?: string;
  isDefault?: boolean;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const LanguageSchema: Schema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    nativeName: { type: String },
    isDefault: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Language = mongoose.model<ILanguage>('Language', LanguageSchema);