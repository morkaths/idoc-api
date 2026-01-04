import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════════════════════
// FILE TYPES: Xử lý file và tải lên
// ═══════════════════════════════════════════════════════════════════════════════

export const FileMetaSchema = z.object({
    _id: z.string(),
    key: z.string(),
    filename: z.string(),
    mimeType: z.string(),
    type: z.string(),
    size: z.number().int(),
    url: z.string(),
    provider: z.string(),
    uploadedBy: z.string(),
});

export type FileMeta = z.infer<typeof FileMetaSchema>;
