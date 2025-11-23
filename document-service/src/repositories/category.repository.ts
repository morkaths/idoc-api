import { Category, ICategory } from "src/models/category.model";
import { BaseRepository } from "../core/base.repository";
import * as constants from "src/constants/aggregations/category.aggregation";
import { Types } from "mongoose";

class CategoryRepositoryClass extends BaseRepository<ICategory> {
  constructor() {
    super(Category);
  }

  async findAllWithAllLangs() {
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

  async search(query: string, lang?: string) {
    const regex = new RegExp(query, "i");
    const result = await Category.aggregate([
      { $match: { name: regex } },
      ...constants.CATEGORY_TRANS_AGGREGATION(lang)
    ]);
    return result;
  }
  
}

const CategoryRepository = new CategoryRepositoryClass();

export default CategoryRepository;