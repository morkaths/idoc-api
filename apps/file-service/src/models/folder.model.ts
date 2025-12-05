import mongoose, { Document, Schema } from "mongoose";

export interface IFolder extends Document {
  name: string;
  parentId?: string;         // Cho phép thư mục lồng nhau
  ownerId?: string;          // Người sở hữu/thư mục cá nhân
  createdAt?: Date;
  updatedAt?: Date;
}

const FolderSchema = new Schema<IFolder>(
  {
    name: { type: String, required: true, trim: true },
    parentId: { type: Schema.Types.ObjectId, ref: "Folder" },
    ownerId: { type: String, trim: true }
  },
  { timestamps: true }
);

FolderSchema.index({ ownerId: 1, name: 1 }, { unique: true });

export const Folder = mongoose.model<IFolder>("Folder", FolderSchema);