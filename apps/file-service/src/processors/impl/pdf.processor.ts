import * as pdfParse from 'pdf-parse';
import { IFileProcessor } from '../file-processor.interface';

export class PdfProcessor implements IFileProcessor {
  canProcess(mimeType: string): boolean {
    return mimeType === 'application/pdf';
  }

  async process(buffer: Buffer): Promise<Record<string, any>> {
    const data = await (pdfParse as any).default(buffer);
    return {
      pages: data.numpages,
      text: data.text.substring(0, 1000),
      author: data.info?.Author,
      title: data.info?.Title,
      creationDate: data.info?.CreationDate,
    };
  }
}