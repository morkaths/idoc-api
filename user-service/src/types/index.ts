export * from './request';
export * from './api.types';
export * from './auth.types';
// Phân trang
export interface Pagination {
  total: number;  // Tổng số item (bản ghi) trong toàn bộ dữ liệu
  limit: number;  // Số item trên mỗi trang (page size)
  page: number;   // Trang hiện tại (bắt đầu từ 1)
  pages: number;  // Tổng số trang (tính từ total/limit)
}