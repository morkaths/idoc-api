import type { Pagination, AuthUser } from './index';

// ═══════════════════════════════════════════════════════════════════════════════
// API TYPES: Xử lý phản hồi API
// ═══════════════════════════════════════════════════════════════════════════════

export interface ApiResponse<T> {
  success: boolean;
  status?: number;
  message?: string;
  token?: AuthToken;
  user?: AuthUser;
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
  user: AuthUser;
  token: AuthToken;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
  authenticated: boolean;
}
