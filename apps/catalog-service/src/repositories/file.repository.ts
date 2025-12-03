import { Types } from "mongoose";
import { File, IFile } from "src/models/file.model";
import { BaseRepository } from "../core/base.repository";
import { aggregateFile } from "src/constants/aggregations/file.aggregation";

class FileRepositoryClass extends BaseRepository<IFile> {
  constructor() {
    super(File);
  }

  async findAll(lang?: string) {
    return File.aggregate(aggregateFile(lang));
  }

  async findById(id: string, lang?: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid ObjectId");
    }
    const result = await File.aggregate(aggregateFile(lang, { _id: new Types.ObjectId(id) }));
    return result[0] ?? null;
  }

  async findByCategory(categoryId: string, lang?: string) {
    if (!Types.ObjectId.isValid(categoryId)) {
      throw new Error("Invalid ObjectId");
    }
    const match = { categoryIds: new Types.ObjectId(categoryId) };
    return File.aggregate(aggregateFile(lang, match));
  }

  async search(params: { [key: string]: any }) {
    const {
      query,
      lang,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      ...rest
    } = params;

    const p = Math.max(1, Number(page));
    const l = Math.max(1, Number(limit));
    const sortStage = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
    const conditions: any[] = [];

    if (query) {
      const regex = new RegExp(String(query), "i");
      conditions.push({
        $or: [
          { title: regex },
          { description: regex },
          { slug: regex }
        ]
      });
    }

    Object.entries(rest).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        conditions.push({ [key]: value });
      }
    });

    const match = conditions.length > 0 ? { $and: conditions } : {};
    const pipeline = [
      ...aggregateFile(lang, match),
      { $sort: sortStage }
    ];

    return this.paginateAggregate(pipeline, p, l);
  }
}

const FileRepository = new FileRepositoryClass();
export default FileRepository;