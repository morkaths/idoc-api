import mongoose, { Document, Schema } from 'mongoose';

export interface IProfile extends Document {
  userId: mongoose.Types.ObjectId;
  fullName?: string;
  birthday?: Date;
  avatar?: string;
  bio?: string;
  location?: string;
  updatedAt?: Date;
}

const ProfileSchema = new Schema<IProfile>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  fullName: { type: String, trim: true, maxlength: 100 },
  birthday: { type: Date },
  avatar: { type: String, trim: true, maxlength: 255, default: '' },
  bio: { type: String, trim: true, maxlength: 500, default: '' },
  location: { type: String, trim: true, maxlength: 100, default: '' },
}, { timestamps: { updatedAt: true, createdAt: false } });

export const Profile = mongoose.model<IProfile>('Profile', ProfileSchema);