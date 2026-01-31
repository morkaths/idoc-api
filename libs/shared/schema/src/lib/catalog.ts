import { z } from 'zod';
import { dateOrString } from './common';

// ═══════════════════════════════════════════════════════════════════════════════
// DOCUMENT TYPES: Xử lý tài liệu, sách và tác giả
// ═══════════════════════════════════════════════════════════════════════════════
export const AuthorSchema = z.object({
    id: z.string(),
    name: z.string().trim().min(1).max(100),
    avatarUrl: z.string().url().trim().optional().or(z.literal('')),
    birthDate: dateOrString,
    nationality: z.string().trim().max(100).optional(),
    bio: z.string().trim().max(1000).optional(),
    createdAt: dateOrString,
    updatedAt: dateOrString,
});

export const CategorySchema = z.object({
    id: z.string(),
    slug: z.string().trim().min(1).max(100).optional(),
    parentId: z.string().nullable().optional(),
    translations: z.array(
        z.object({
            lang: z.string().min(2).max(5),
            name: z.string().trim().min(1).max(100),
            description: z.string().trim().max(500).optional(),
            createdAt: dateOrString,
            updatedAt: dateOrString,
        })
    )
        .optional(),
    createdAt: dateOrString,
    updatedAt: dateOrString,
});

export const BookSchema = z.object({
    id: z.string(),
    title: z.string().trim().min(1).max(255),
    slug: z.string().trim().max(255).optional(),
    description: z.string().trim().max(5000).optional(),
    publisher: z.string().trim().max(255).optional(),
    publishedDate: dateOrString,
    edition: z.string().trim().max(50).optional(),
    isbn: z.string().trim().max(20).optional(),
    language: z.string().trim().min(2).max(10).optional(),
    pages: z.number().int().min(0).optional(),
    price: z.number().min(0).optional(),
    stock: z.number().int().min(0).optional(),
    coverUrl: z.string().trim().url().optional().or(z.literal('')),
    fileKey: z.string().trim().optional(),
    tags: z.array(z.string().trim()).optional(),
    updatedBy: z.string().trim().optional(),
    createdAt: dateOrString,
    updatedAt: dateOrString,
    authorIds: z.array(z.string()).optional(),
    categoryIds: z.array(z.string()).optional(),
    authors: z.array(AuthorSchema).optional(),
    categories: z.array(CategorySchema).optional(),
    rating: z.number().min(0).max(5).optional(),
    totalReviews: z.number().int().min(0).optional(),
});

export const DocumentSchema = z.object({
    id: z.string(),
    title: z.string().trim().min(1).max(255),
    slug: z.string().trim().max(255).optional(),
    description: z.string().trim().max(5000).optional(),
    categoryIds: z.array(z.string()).optional(),
    language: z.string().trim().min(2).max(10).optional(),
    kind: z.string().trim().min(1),
    coverUrl: z.string().trim().url().optional().or(z.literal('')),
    fileIds: z.array(z.string().trim()),
    metadata: z.record(z.any()).optional(),
    access: z.enum(['public', 'private', 'restricted']).optional(),
    averageRating: z.number().min(0).max(5).optional(),
    reviewCount: z.number().int().min(0).optional(),
    downloadCount: z.number().int().min(0).optional(),
    updatedBy: z.string().trim().optional(),
    createdAt: dateOrString,
    updatedAt: dateOrString,
});

export type Author = z.infer<typeof AuthorSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type Book = z.infer<typeof BookSchema>;
export type Document = z.infer<typeof DocumentSchema>;
