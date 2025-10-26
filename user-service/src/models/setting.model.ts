import mongoose, { Document, Schema } from 'mongoose';

export interface ISetting extends Document {
  userId: mongoose.Types.ObjectId;
  appearance?: {
    theme?: 'light' | 'dark' | 'system';
  };
  notifications?: {
    email?: boolean;
    sms?: boolean;
  };
  updatedAt?: Date;
}

const SettingSchema = new Schema<ISetting>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  appearance: {
    theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' }
  },
  notifications: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: false }
  }
}, { timestamps: { updatedAt: true, createdAt: false } });

export const Setting = mongoose.model<ISetting>('Setting', SettingSchema);