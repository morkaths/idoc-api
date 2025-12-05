import { BaseRepository } from "../core/base.repository";
import {  File, IFile } from "../models/file.model";

export class FileRepository extends BaseRepository<IFile> {
  constructor() {
    super(File);
  }

  async findByChecksum(checksum: string) {
    return this.findOne({ checksum });
  }

  async findByProviderAndPath(provider: string, path: string) {
    return this.findOne({ provider, path });
  }

  async findByUser(userId: string, page = 1, limit = 20) {
    return this.paginate(
      { uploadedBy: userId },
      { page, limit, sort: { createdAt: -1 }, lean: true }
    );
  }

  async findByMimeType(mimeType: string, page = 1, limit = 20) {
    return this.paginate(
      { mimeType },
      { page, limit, sort: { createdAt: -1 }, lean: true }
    );
  }

  async findByFilename(keyword: string, page = 1, limit = 20) {
    return this.paginate(
      { filename: { $regex: keyword, $options: 'i' } },
      { page, limit, sort: { createdAt: -1 }, lean: true }
    );
  }
}

export const fileRepository = new FileRepository();