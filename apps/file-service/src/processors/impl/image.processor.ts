import sharp from 'sharp';
import { IFileProcessor } from '../file-processor.interface';

export class ImageProcessor implements IFileProcessor {
  canProcess(mimeType: string): boolean {
    return mimeType.startsWith('image/');
  }

  async process(buffer: Buffer): Promise<Record<string, any>> {
    const metadata = await sharp(buffer).metadata();
    
    // Tạo thumbnail
    const thumbnail = await sharp(buffer)
      .resize(200, 200, { fit: 'cover' })
      .toBuffer();

    return {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      hasAlpha: metadata.hasAlpha,
      thumbnailSize: thumbnail.length,
    };
  }
}