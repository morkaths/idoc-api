import { BaseRepository } from "../core/base.repository";
import {  File, IFile } from "../models/file.model";

export class FileRepository extends BaseRepository<IFile> {
  constructor() {
    super(File);
  }

  async findList(
    page: number,
    limit: number,
    filter: { [key: string]: any }
  ) {
    const {
      query,
      mimeType,
      uploadedBy,
      ...rest
    } = filter;

    const p = Math.max(1, Number(page));
    const l = Math.max(1, Number(limit));
    const conditions: any[] = [];

    if (query) {
      const regex = new RegExp(String(query), "i");
      conditions.push({
        $or: [
          { filename: regex },
          { key: regex },
        ],
      });
    }
    if (mimeType) {
      conditions.push({ mimeType });
    }
    if (uploadedBy) {
      conditions.push({ uploadedBy });
    }
    Object.entries(rest).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        conditions.push({ [key]: value });
      }
    });

    const match = conditions.length > 0 ? { $and: conditions } : {};
    const options = {
      page: p,
      limit: l,
      sort: { createdAt: -1 },
      lean: true,
    };

    return this.paginate(match, options);
  }

  async findByKey(key: string) {
    return this.findOne({ key });
  }

  async findByChecksum(checksum: string) {
    return this.findOne({ checksum });
  }

  async findByUser(userId: string, page = 1, limit = 20) {
    return this.paginate(
      { uploadedBy: userId },
      { page, limit, sort: { createdAt: -1 }, lean: true }
    );
  }

  override async delete(key: string): Promise<boolean> {
    const result = await this.model.deleteOne({ key });
    return result.deletedCount > 0;
  }
}

export const fileRepository = new FileRepository();