import { Category, ICategory } from "src/models/category.model";
import { BaseRepository } from "../core/base.repository";

const CategoryRepository = new BaseRepository<ICategory>(Category);

export default CategoryRepository;