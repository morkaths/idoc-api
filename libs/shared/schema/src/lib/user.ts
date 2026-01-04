import { z } from 'zod';
import { dateOrString } from './common';

// ═══════════════════════════════════════════════════════════════════════════════
// USER TYPES: Xử lý hồ sơ và cài đặt người dùng
// ═══════════════════════════════════════════════════════════════════════════════
export const ProfileSchema = z.object({
    _id: z.string(),
    userId: z.string(),
    fullName: z.string().optional(),
    birthday: dateOrString,
    avatar: z.string().optional(),
    bio: z.string().optional(),
    location: z.string().optional(),
    updatedAt: dateOrString,
});

const ThemeSchema = z
    .object({
        mode: z.enum(['light', 'dark', 'system']).optional(),
        layout: z.enum(['vertical', 'horizontal']).optional(),
        language: z.string().optional(),
    })
    .optional();

const NotificationsSchema = z
    .object({
        email: z.boolean().optional(),
        sms: z.boolean().optional(),
    })
    .optional();

export const SettingsSchema = z.object({
    _id: z.string(),
    userId: z.string(),
    theme: ThemeSchema,
    notifications: NotificationsSchema,
    updatedAt: dateOrString,
});

export type Profile = z.infer<typeof ProfileSchema>;
export type Settings = z.infer<typeof SettingsSchema>;
