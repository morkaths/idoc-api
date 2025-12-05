export interface IFileProcessor {
  /**
   * Kiểm tra processor có hỗ trợ loại file này không
   */
  canProcess(mimeType: string): boolean;

  /**
   * Xử lý file và trả về metadata bổ sung
   */
  process(buffer: Buffer, mimeType: string): Promise<Record<string, any>>;
}