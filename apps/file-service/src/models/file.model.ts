import mongoose, { Document, Schema } from "mongoose";

export type StorageProvider = "local" | "s3" | "minio" | "gcs" | "azure";

export interface IFile extends Document {
  filename: string;                   // tên file gốc
  objectName: string;                 // tên đối tượng/file trong hệ thống lưu trữ
  mimeType: string;                   // loại MIME của file
  type: string;
  size: number;                       // kích thước file tính bằng byte
  bucket?: string;                    // tên bucket trong MinIO/S3
  provider: StorageProvider;          // nhà cung cấp dịch vụ lưu trữ 
  checksum: string;                   // mã kiểm tra tính toàn vẹn của file
  metadata?: Record<string, any>;     // thông tin bổ sung dưới dạng key-value
  uploadedBy?: string;                // ID người dùng đã tải lên file
  createdAt?: Date;
  updatedAt?: Date;
}

const FileSchema = new Schema<IFile>(
  {
    filename: { type: String, required: true, trim: true },
    objectName: { type: String, required: true, unique: true, trim: true },
    mimeType: { type: String, required: true, trim: true },
    type: { 
      type: String, 
      enum: ["ebook", "document", "image", "video", "audio", "archive", "other"], 
      default: "other"
    },
    size: { type: Number, required: true },
    bucket: { type: String, trim: true },
    provider: { 
      type: String, 
      enum: ["local", "s3", "minio", "gcs", "azure"], 
      default: "minio" 
    },
    checksum: { type: String },
    metadata: { type: Schema.Types.Mixed },
    uploadedBy: { type: String, trim: true }
  }, 
  { timestamps: true }
);

FileSchema.index({ provider: 1, bucket: 1 });
FileSchema.index({ checksum: 1 });
FileSchema.index({ uploadedBy: 1 });
FileSchema.index({ createdAt: -1 });

export const File = mongoose.model<IFile>("FileMetadata", FileSchema);