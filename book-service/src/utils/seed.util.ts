/**
 * Utility functions for seeding data
 * Chỉ chứa các hàm tiện ích tái sử dụng, không chứa dữ liệu mock cụ thể
 */

// ==================== Random Functions ====================

/**
 * Lấy random 1 item từ array
 */
export const randomItem = <T>(array: T[]): T => {
  if (array.length === 0) {
    throw new Error('Array is empty');
  }
  return array[Math.floor(Math.random() * array.length)];
};

/**
 * Random số nguyên trong khoảng [min, max]
 */
export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Random số thực trong khoảng [min, max]
 */
export const randomFloat = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

/**
 * Random boolean (true/false)
 * @param probability - Xác suất trả về true (0-1), mặc định 0.5
 */
export const randomBoolean = (probability: number = 0.5): boolean => {
  return Math.random() < probability;
};

/**
 * Random nhiều items từ array (không trùng lặp)
 * @param array - Array để random
 * @param min - Số lượng tối thiểu (mặc định 1)
 * @param max - Số lượng tối đa (mặc định = array.length)
 */
export const randomItems = <T>(array: T[], min: number = 1, max?: number): T[] => {
  if (array.length === 0) return [];
  
  const maxCount = max ? Math.min(max, array.length) : array.length;
  const count = randomInt(min, maxCount);
  
  // Shuffle array và lấy count items
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// ==================== Date Functions ====================

/**
 * Random Date trong khoảng năm
 */
export const randomDate = (startYear: number, endYear: number): Date => {
  const year = randomInt(startYear, endYear);
  const month = randomInt(0, 11);
  const day = randomInt(1, 28); // 28 để tránh lỗi với tháng 2
  return new Date(year, month, day);
};

/**
 * Random Date từ Date object
 */
export const randomDateBetween = (start: Date, end: Date): Date => {
  const startTime = start.getTime();
  const endTime = end.getTime();
  const randomTime = randomInt(startTime, endTime);
  return new Date(randomTime);
};

// ==================== String Functions ====================

/**
 * Tạo slug từ string (loại bỏ dấu tiếng Việt)
 */
export const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    // Loại bỏ dấu tiếng Việt
    .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
    .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
    .replace(/[ìíịỉĩ]/g, 'i')
    .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
    .replace(/[ùúụủũưừứựửữ]/g, 'u')
    .replace(/[ỳýỵỷỹ]/g, 'y')
    .replace(/đ/g, 'd')
    // Loại bỏ ký tự đặc biệt
    .replace(/[^a-z0-9-]/g, '')
    // Loại bỏ nhiều dấu gạch ngang liên tiếp
    .replace(/-+/g, '-')
    // Loại bỏ dấu gạch ngang ở đầu và cuối
    .replace(/^-+|-+$/g, '');
};

/**
 * Random string với độ dài cho trước
 */
export const randomString = (length: number = 10, chars: string = 'abcdefghijklmnopqrstuvwxyz0123456789'): string => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// ==================== Helper Functions ====================

/**
 * Tìm ID từ array dựa vào field name
 */
export const findIdByName = <T extends { _id: any; [key: string]: any }>(
  array: T[],
  fieldName: string,
  value: string
): any => {
  const item = array.find(item => item[fieldName] === value);
  return item?._id || null;
};

/**
 * Tạo ISBN random
 */
export const generateISBN = (prefix: string = '978'): string => {
  const random = randomString(9, '0123456789');
  return `${prefix}${random}`;
};

/**
 * Format file size từ bytes sang string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Tạo URL cho image/file
 */
export const randomImageUrl = (basePath: string, filename: string, extension: string = 'jpg'): string => {
  const slug = createSlug(filename);
  return `https://example.com/${basePath}/${slug}.${extension}`;
};

