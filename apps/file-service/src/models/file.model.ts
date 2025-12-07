import mongoose, { Document, Schema } from "mongoose";

export enum StorageProvider {
  LOCAL = "local",
  S3 = "s3",
  MINIO = "minio",
  GCS = "gcs",
  AZURE = "azure",
  CLOUDINARY = "cloudinary",
}

export enum FileType {
  EBOOK = "ebook",
  DOCUMENT = "document",
  IMAGE = "image",
  VIDEO = "video",
  AUDIO = "audio",
  ARCHIVE = "archive",
  OTHER = "other",
}

export interface IFile extends Document {
  key: string;                       
  filename: string;                   // tên file gốc
  objectName: string;                 // tên đối tượng/file trong hệ thống lưu trữ
  mimeType: string;                   // loại MIME của file
  type: FileType;
  size: number;                       // kích thước file tính bằng byte
  bucket?: string;                    // tên bucket trong MinIO/S3
  provider: StorageProvider;          // nhà cung cấp dịch vụ lưu trữ 
  checksum?: string;                   // mã kiểm tra tính toàn vẹn của file
  metadata?: Record<string, any>;     // thông tin bổ sung dưới dạng key-value
  uploadedBy?: string;                // ID người dùng đã tải lên file
  createdAt?: Date;
  updatedAt?: Date;
}

const FileSchema = new Schema<IFile>(
  {
    key: { type: String, unique: true, sparse: true, trim: true },
    filename: { type: String, required: true, trim: true },
    objectName: { type: String, required: true, unique: true, trim: true },
    mimeType: { type: String, required: true, trim: true },
    type: { 
      type: String, 
      enum: Object.values(FileType), 
      default: FileType.OTHER,
    },
    size: { type: Number, required: true },
    bucket: { type: String, trim: true },
    provider: { 
      type: String, 
      enum: Object.values(StorageProvider), 
      default: StorageProvider.MINIO
    },
    checksum: { type: String },
    metadata: { type: Schema.Types.Mixed },
    uploadedBy: { type: String, trim: true }
  }, 
  { timestamps: true }
);

FileSchema.index({ key: 1 });
FileSchema.index({ provider: 1, bucket: 1 });
FileSchema.index({ checksum: 1 });
FileSchema.index({ uploadedBy: 1 });
FileSchema.index({ createdAt: -1 });

export const File = mongoose.model<IFile>("FileMetadata", FileSchema);