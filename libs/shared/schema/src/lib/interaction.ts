import { z } from 'zod';
import { dateOrString } from './common';

// ═══════════════════════════════════════════════════════════════════════════════
// INTERACTION TYPES: Xử lý tương tác
// ═══════════════════════════════════════════════════════════════════════════════

export const BookmarkSchema = z.object({
  id: z.string(),
  userId: z.string().trim(),
  itemId: z.string().trim(),
  collectionId: z.string().optional(),
  createdAt: dateOrString,
  updatedAt: dateOrString,
});

export const CollectionSchema = z.object({
  id: z.string(),
  userId: z.string().trim(),
  name: z.string().trim().min(1).max(100),
  description: z.string().trim().max(500).optional(),
  itemCount: z.number().int().min(0).optional(),
  isPublic: z.boolean().optional(),
  createdAt: dateOrString,
  updatedAt: dateOrString,
});

export const ReviewSchema = z.object({
  id: z.string(),
  userId: z.string().trim(),
  itemId: z.string().trim(),
  rating: z.number().min(0).max(5),
  content: z.string().trim().max(2000).optional(),
  isHidden: z.boolean().optional(),
  createdAt: dateOrString,
  updatedAt: dateOrString,
});

export type Bookmark = z.infer<typeof BookmarkSchema>;
export type Collection = z.infer<typeof CollectionSchema>;
export type Review = z.infer<typeof ReviewSchema>;
