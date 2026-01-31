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
    updatedAt: dateOrString.optional(),
});

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
