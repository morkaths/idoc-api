import { Category, ICategory } from "src/models/category.model";
import { BaseRepository } from "../core/base.repository";
import { aggregateCategory } from "src/constants/aggregations/category.aggregation";
import { Types } from "mongoose";

class CategoryRepositoryClass extends BaseRepository<ICategory> {
  constructor() {
    super(Category);
  }

  async findAll(lang?: string) {
    return Category.aggregate(aggregateCategory(lang));
  }
  
  async findAllPaginated(lang?: string, page: number = 1, limit: number = 10) {
    const p = Math.max(1, Number(page));
    const l = Math.max(1, Number(limit));
    const pipeline = aggregateCategory(lang);
    return this.paginateAggregate(pipeline, p, l);
  }

  async findById(id: string, lang?: string) {
    const match = { _id: new Types.ObjectId(id) };
    const result = await Category.aggregate(aggregateCategory(lang, match));
    return result[0] ?? null;
  }

  async search(params: { [key: string]: any }) {
    const {
      query,
      lang,
      page = 1,
      limit = 10,
      sortBy = 'slug',
      sortOrder = 'asc',
      ...rest
    } = params;

    const p = Math.max(1, Number(page));
    const l = Math.max(1, Number(limit));
    const sortStage = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const conditions: any[] = [];
    if (query) {
      const regex = new RegExp(String(query), 'i');
      conditions.push({ slug: regex });
    }

    Object.entries(rest).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        conditions.push({ [key]: value });
      }
    });

    const match = conditions.length > 0 ? { $and: conditions } : {};
    const pipeline = [
      ...aggregateCategory(lang, match),
      { $sort: sortStage }
    ];

    return this.paginateAggregate(pipeline, p, l);
  }
  
}

const CategoryRepository = new CategoryRepositoryClass();

export default CategoryRepository;