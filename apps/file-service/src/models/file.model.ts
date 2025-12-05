import mongoose, { Document, Schema } from "mongoose";

export type StorageProvider = "local" | "s3" | "minio" | "gcs" | "azure";

export interface IFile extends Document {
  filename: string;                   // tên file lưu trữ
  originalName: string;               // tên file gốc khi upload
  mimeType: string;                   // loại MIME của file
  size: number;                       // kích thước file tính bằng byte
  path: string;                       // đường dẫn lưu trữ file
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
    originalName: { type: String, required: true, trim: true },
    mimeType: { type: String, required: true, trim: true },
    size: { type: Number, required: true },
    path: { type: String, required: true },
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

FileSchema.index({ provider: 1, bucket: 1, path: 1 }, { unique: true });
FileSchema.index({ checksum: 1 });
FileSchema.index({ uploadedBy: 1 });
FileSchema.index({ createdAt: -1 });

export const File = mongoose.model<IFile>("FileMetadata", FileSchema);