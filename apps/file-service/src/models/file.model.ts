import mongoose, { Document, Schema } from "mongoose";
import { MINIO_BUCKET, MINIO_ENDPOINT, MINIO_USE_SSL } from "src/config/env.config";

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
    checksum: { type: String, index: true },
    metadata: { type: Schema.Types.Mixed },
    uploadedBy: { type: String, trim: true }
  }, 
  { timestamps: true }
);

FileSchema.index({ provider: 1, bucket: 1, path: 1 }, { unique: true });
FileSchema.index({ checksum: 1 });
FileSchema.index({ uploadedBy: 1 });
FileSchema.index({ createdAt: -1 });

FileSchema.virtual("url").get(function (this: IFile) {
  if (this.provider === "local") {
    const base = process.env.FILE_BASE_URL || "http://localhost:3000/files";
    return `${base}/${encodeURIComponent(this.filename)}`;
  }
  if (this.provider === "minio" || this.provider === "s3") {
    const protocol = MINIO_USE_SSL ? 'https' : 'http';
    const endpoint = MINIO_ENDPOINT.replace(/^https?:\/\//, '');
    const bucket = this.bucket || MINIO_BUCKET || "idoc";
    return `${protocol}://${endpoint}/${bucket}/${this.path}`;
  }

  if (this.provider === "gcs") {
    return `gs://${this.bucket || "<bucket>"}/${this.path}`;
  }
  
  if (this.provider === "azure") {
    return `https://${this.bucket || "<storage>"}.blob.core.windows.net/${this.path}`;
  }

  return this.path || this.filename;
});

// Transform output
const transform = (_doc: any, ret: any) => {
  ret.id = ret._id;
  delete ret.__v;
  delete ret.checksum;
  delete ret.path;
  delete ret.bucket;
  return ret;
};

FileSchema.set("toJSON", { virtuals: true, transform });
FileSchema.set("toObject", { virtuals: true, transform });

export const File = mongoose.model<IFile>("FileMetadata", FileSchema);