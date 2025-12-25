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
   * @param folder Thư mục lưu trữ
   * @param filename Tên file gốc
   * @returns Đường dẫn lưu trữ và key của file
   */
  static createStoragePath(folder: string, filename: string): {
    path: string;
    key: string;
  } {
    const key = this.createKey();
    const ext = path.extname(filename).toLowerCase();

    const objectPath = `${folder}/${key}${ext}`;
    return {
      path: objectPath,
      key
    };
  }
}