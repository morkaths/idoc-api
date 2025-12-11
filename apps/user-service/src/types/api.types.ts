import type { User } from './auth.types';
import type { Pagination } from './index';

// ═══════════════════════════════════════════════════════════════════════════════
// API TYPES: Xử lý phản hồi API
// ═══════════════════════════════════════════════════════════════════════════════

export interface ApiResponse<T> {
  success: boolean;
  status: number;
  message?: string;
  token?: string;
  user?: User;
  data?: T;
  pagination?: Pagination;
}

export interface ErrorResponse {
  success: false;
  status: number;
  message: string;
  errors?: string[];
}