import { CategoryTranslation, ICategoryTranslation } from "src/models/categoryTranslation.model";
import { BaseRepository } from "../core/base.repository";

const CategoryTransRepository = new BaseRepository<ICategoryTranslation>(CategoryTranslation);

export default CategoryTransRepository;