import mongoose, { Document, Schema } from 'mongoose';

export interface IProfile extends Document {
  userId: number;
  fullName?: string;
  birthday?: Date;
  avatar?: string;
  bio?: string;
  location?: string;
  updatedAt?: Date;
}

const ProfileSchema = new Schema<IProfile>(
  {
    userId: { type: Number, required: true, unique: true },
    fullName: { type: String, trim: true, maxlength: 100 },
    birthday: { type: Date },
    avatar: { type: String, trim: true, maxlength: 255 },
    bio: { type: String, trim: true, maxlength: 500 },
    location: { type: String, trim: true, maxlength: 500 },
  },
  { timestamps: { updatedAt: true, createdAt: false } }
);

export const Profile = mongoose.model<IProfile>('Profile', ProfileSchema);