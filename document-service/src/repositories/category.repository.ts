import { Category, ICategory } from "src/models/category.model";
import { BaseRepository } from "../core/base.repository";
import * as constants from "src/constants/aggregations/category.aggregation";
import { Types } from "mongoose";

class CategoryRepositoryClass extends BaseRepository<ICategory> {
  constructor() {
    super(Category);
  }

  async findAllTrans() {
    return Category.aggregate(constants.CATEGORY_TRANS_AGGREGATION(undefined));
  }

  async findAll(lang?: string) {
    return Category.aggregate(constants.CATEGORY_TRANS_AGGREGATION(lang));
  }

  async findById(id: string, lang?: string) {
    const result = await Category.aggregate([
      { $match: { _id: new Types.ObjectId(id) } },
      ...constants.CATEGORY_TRANS_AGGREGATION(lang)
    ]);
    return result[0] ?? null;
  }

  async search(params: { [key: string]: any }) {
    const { query, lang, ...rest } = params;
    const regex = new RegExp(query, "i");
    const conditions: any[] = [];

    if (query) {
      conditions.push({ name: regex });
    }
    Object.entries(rest).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        conditions.push({ [key]: value });
      }
    });
    const match = conditions.length > 0 ? { $and: conditions } : {};
    return Category.aggregate(constants.CATEGORY_AGGREGATION(lang, match));
  }
  
}

const CategoryRepository = new CategoryRepositoryClass();

export default CategoryRepository;