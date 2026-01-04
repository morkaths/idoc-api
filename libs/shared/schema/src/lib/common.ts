import { z } from 'zod';

export const dateOrString = z.preprocess((val) => {
    if (val == null || val === '') return undefined;
    if (val instanceof Date) return val;
    if (typeof val === 'string' || typeof val === 'number') {
        const d = new Date(val as string | number);
        return isNaN(d.getTime()) ? undefined : d;
    }
    return undefined;
}, z.date().optional());

export const AuditSchema = z.object({
    createdAt: dateOrString,
    updatedAt: dateOrString.optional(), // Some use modifiedAt, some updatedAt. using updatedAt as standard or both for compat? 
    // Looking at original schema:
    // Permission/Role/User: createdAt, modifiedAt, modifiedBy
    // Author/Category/Book: createdAt, updatedAt (Book has updatedBy)
    // FileMeta: none
    // Borrow: createdAt, updatedAt
    // Profile/Settings: updatedAt
    // Let's keep specific fields in specific schemas for now to avoid breaking changes, but export common ones suitable for composition if needed.
});

// Re-export specific audit parts if we want to standardize later, 
// for now I'll just keep the helper 'dateOrString' which is the main common piece.

export interface Pagination {
    total: number;  // Tổng số item (bản ghi) trong toàn bộ dữ liệu
    limit: number;  // Số item trên mỗi trang (page size)
    page: number;   // Trang hiện tại (bắt đầu từ 1)
    pages: number;  // Tổng số trang (tính từ total/limit)
}

export interface FindParams {
    page?: number;
    limit?: number;
    query?: string;
    sorts?: Record<string, string>[];
    filters?: Record<string, unknown>[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// API TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface ApiResponse<T> {
    success: boolean;
    status?: number;
    message?: string;
    token?: AuthToken;
    user?: any; // Avoiding circular dependency with AuthUser, or we can use generic
    data?: T;
    pagination?: Pagination;
}

export interface ApiError {
    message: string;
    errors?: string[];
}

export interface ErrorResponse {
    success: false;
    message: string;
    errors?: string[];
    statusCode: number;
}

export interface AuthenticationResponse {
    user: any; // typed in usage
    token: AuthToken;
}

export interface AuthToken {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresIn: number;
    authenticated: boolean;
}
