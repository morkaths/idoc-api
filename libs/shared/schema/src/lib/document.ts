import { z } from 'zod';
import { dateOrString } from './common';

// ═══════════════════════════════════════════════════════════════════════════════
// DOCUMENT TYPES: Xử lý tài liệu, sách và tác giả
// ═══════════════════════════════════════════════════════════════════════════════
export const AuthorSchema = z.object({
    _id: z.string(),
    name: z.string(),
    avatarUrl: z.string().optional(),
    birthDate: dateOrString,
    nationality: z.string().optional(),
    bio: z.string().optional(),
    createdAt: dateOrString,
    updatedAt: dateOrString,
});

export const CategorySchema = z.object({
    _id: z.string(),
    slug: z.string().optional(),
    parentId: z.string().nullable().optional(),
    translations: z.array(
        z.object({
            lang: z.string(),
            name: z.string(),
            description: z.string().optional(),
            createdAt: dateOrString,
            updatedAt: dateOrString,
        })
    )
        .optional(),
    createdAt: dateOrString,
    updatedAt: dateOrString,
});

export const BookSchema = z.object({
    _id: z.string(),
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string().optional(),
    slug: z.string().optional(),
    publisher: z.string().optional(),
    publishedDate: dateOrString,
    edition: z.string().optional(),
    isbn: z.string().optional(),
    language: z.string().optional(),
    pages: z.number().int().optional(),
    price: z.number().optional(),
    stock: z.number().int().optional(),
    coverUrl: z.string().optional(),
    fileKey: z.string().optional(),
    tags: z.array(z.string()).optional(),
    createdAt: dateOrString,
    updatedAt: dateOrString,
    updatedBy: z.string().optional(),
    authorIds: z.array(z.string()).optional(),
    categoryIds: z.array(z.string()).optional(),
    authors: z.array(AuthorSchema).optional(),
    categories: z.array(CategorySchema).optional(),
});

export type Author = z.infer<typeof AuthorSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type Book = z.infer<typeof BookSchema>;
