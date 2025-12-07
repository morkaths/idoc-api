import { randomBytes } from 'crypto';
import * as path from 'path';

export class KeyGenerator {
  /**
   * Tạo key ngẫu nhiên
   * @param length Độ dài chuỗi ngẫu nhiên
   * @param prefix Tiền tố của key
   * @returns 
   */
  static createKey(length = 16, prefix = "idoc"): string {
    const buffer = randomBytes(Math.ceil(length * 1.5));
    const randomStr = buffer
      .toString('base64')
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, length);
    return `${prefix}_${randomStr}`;
  }

  /**
   * Tạo đường dẫn lưu trữ file
   * @param type Loại file
   * @param filename Tên file gốc
   * @returns Đường dẫn lưu trữ và key của file
   */
  static createStoragePath(type: string, filename: string): {
    path: string;
    key: string;
  } {
    const key = this.createKey();
    const ext = path.extname(filename).toLowerCase();
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');

    const objectPath = `${type}/${year}/${month}/${key}${ext}`;
    return {
      path: objectPath,
      key
    };
  }
}