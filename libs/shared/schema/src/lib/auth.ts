import { z } from 'zod';
import { dateOrString } from './common';

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH TYPES: Xử lý người dùng, vai trò và quyền
// ═══════════════════════════════════════════════════════════════════════════════
export const PermissionSchema = z.object({
    id: z.string(),
    code: z.string(),
    name: z.string(),
    createdAt: dateOrString,
    modifiedAt: dateOrString,
    modifiedBy: z.string().optional(),
});

export const RoleSchema = z.object({
    id: z.string(),
    code: z.string(),
    name: z.string(),
    permissions: z.array(PermissionSchema).optional(),
    permissionIds: z.array(z.string()).optional(),
    createdAt: dateOrString,
    modifiedAt: dateOrString,
    modifiedBy: z.string().optional(),
});

export const UserSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    username: z.string(),
    password: z.string().optional(),
    status: z.number().int(), // 0: inactive, 1: active, 2: banned
    roles: z.array(RoleSchema).optional(),
    roleIds: z.array(z.string()).optional(),
    createdAt: dateOrString,
    modifiedAt: dateOrString,
    modifiedBy: z.string().optional(),
});

export const LinkedAccountSchema = z.object({
    id: z.string(),
    userId: z.string(),
    provider: z.string(),
    providerId: z.string(),
    linkedAt: dateOrString,
});

export type Permission = z.infer<typeof PermissionSchema>;
export type Role = z.infer<typeof RoleSchema>;
export type User = z.infer<typeof UserSchema>;
export type LinkedAccount = z.infer<typeof LinkedAccountSchema>;

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH TYPES: Xử lý Authentication
// ═══════════════════════════════════════════════════════════════════════════════

export const AuthUserSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    username: z.string(),
    password: z.string().optional(),
    status: z.number().int(),
    roles: z.array(z.string()).optional(),
    permissions: z.array(z.string()).optional(),
});

export const GoogleLoginRequestSchema = z.object({
    idToken: z.string().min(1, 'ID Token is required'),
});

export type AuthUser = z.infer<typeof AuthUserSchema>;
export type GoogleLoginRequest = z.infer<typeof GoogleLoginRequestSchema>;
