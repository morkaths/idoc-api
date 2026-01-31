import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════════════════════
// FILE TYPES: Xử lý file và tải lên
// ═══════════════════════════════════════════════════════════════════════════════

export const FileMetaSchema = z.object({
    id: z.string(),
    key: z.string().trim().optional(),
    filename: z.string().trim(),
    objectName: z.string().trim().optional(),
    mimeType: z.string().trim(),
    type: z.enum(['ebook', 'document', 'image', 'video', 'audio', 'archive', 'other']),
    size: z.number().int().min(0),
    bucket: z.string().trim().optional(),
    url: z.string().url().optional(),
    provider: z.enum(['local', 's3', 'minio', 'gcs', 'azure', 'cloudinary']),
    checksum: z.string().trim().optional(),
    metadata: z.record(z.any()).optional(),
    uploadedBy: z.string().trim().optional(),
    createdAt: dateOrString,
    updatedAt: dateOrString,
});

export type FileMeta = z.infer<typeof FileMetaSchema>;
