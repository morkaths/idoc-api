/**
 * Chuyển Cloudinary URL sang public_id
 * @param url Đường dẫn ảnh Cloudinary
 * @returns public_id hoặc null nếu không hợp lệ
 */
export function extractPublicId(url: string): string | null {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.(jpg|jpeg|png|gif|webp)$/i);
  return match ? match[1] : null;
}
