import mongoose, { Document, Model, Schema } from "mongoose";
import crypto from "crypto";

export type StorageProvider = "local" | "s3" | "minio" | "gcs" | "azure";

export interface IFileMetadata extends Document {
  filename: string;                   // tên file lưu trữ
  originalName: string;               // tên file gốc khi upload
  mimeType: string;                   // loại MIME của file
  size: number;                       // kích thước file tính bằng byte
  path: string;                       // đường dẫn lưu trữ file
  bucket?: string;                    // tên bucket trong MinIO/S3
  provider: StorageProvider;          // nhà cung cấp dịch vụ lưu trữ 
  checksum: string;                   // mã kiểm tra tính toàn vẹn của file
  uploadedBy?: string;                // ID người dùng đã tải lên file
  metadata?: Record<string, any>;     // thông tin bổ sung dưới dạng key-value
  createdAt?: Date;
  updatedAt?: Date;
  publicUrl?: string;                 // URL công khai để truy cập file
}

const FileMetadataSchema = new Schema<IFileMetadata>(
  {
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    path: { type: String, required: true },
    bucket: { type: String },
    provider: { 
      type: String, 
      enum: ["local", "s3", "minio", "gcs", "azure"], 
      default: "minio" 
    },
    checksum: { type: String, index: true },
    uploadedBy: { type: String, trim: true },
    metadata: { type: Schema.Types.Mixed }
  }, 
  { timestamps: true }
);

FileMetadataSchema.index({ provider: 1, bucket: 1, path: 1 }, { unique: true });
FileMetadataSchema.index({ checksum: 1 });
FileMetadataSchema.index({ uploadedBy: 1 });
FileMetadataSchema.index({ createdAt: -1 });

FileMetadataSchema.virtual("publicUrl").get(function (this: IFileMetadata) {
  if (this.provider === "local") {
    const base = process.env.FILE_BASE_URL || "http://localhost:3000/files";
    return `${base}/${encodeURIComponent(this.filename)}`;
  }
  if (this.provider === "minio" || this.provider === "s3") {
    const endpoint = process.env.MINIO_ENDPOINT || "localhost:9000";
    const useSSL = process.env.MINIO_USE_SSL === "true";
    const protocol = useSSL ? "https" : "http";
    const bucket = this.bucket || process.env.MINIO_BUCKET || "idoc";
    
    // Public URL format: http://localhost:9000/bucket/path
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

FileMetadataSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret: any) => {
    ret.id = ret._id;
    delete ret.__v;
    delete ret.checksum;
    delete ret.path;
    delete ret.bucket;
    return ret;
  },
});

FileMetadataSchema.set("toObject", {
  virtuals: true,
  transform: (_doc, ret: any) => {
    ret.id = ret._id;
    delete ret.__v;
    delete ret.checksum;
    delete ret.path;
    delete ret.bucket;
    return ret;
  },
});

FileMetadataSchema.statics.createFromUpload = async function (payload: {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path?: string;
  bucket?: string;
  provider?: StorageProvider;
  uploadedBy?: string;
  metadata?: Record<string, any>;
  buffer?: Buffer;
}) {
  const {
    filename,
    originalName,
    mimeType,
    size,
    path,
    bucket,
    provider = "minio",
    uploadedBy,
    metadata,
    buffer,
  } = payload;

  // compute checksum from buffer if provided
  let checksum: string | undefined;
  if (buffer && buffer.length) {
    checksum = crypto.createHash("sha256").update(buffer).digest("hex");
  }

  // dedupe by checksum when available
  if (checksum) {
    const existing = await this.findOne({ checksum }).exec();
    if (existing) {
      if (process.env.NODE_ENV === "development") {
        console.log(`File already exists with checksum: ${checksum}`);
      }
      return existing;
    }
  }

  const doc = new this({
    filename,
    originalName,
    mimeType,
    size,
    path,
    bucket,
    provider,
    checksum,
    uploadedBy,
    metadata,
  });

  return doc.save();
};

export const FileMetadata = mongoose.model<IFileMetadata>("FileMetadata", FileMetadataSchema);