import { createClassTransformerMapper } from "../core/base.mapper";
import { ICategoryTranslation } from "../models/category-translation.model";
import { CategoryTranslationDto } from "../dtos/category-translation.dto";

export const CategoryTransMapper = createClassTransformerMapper<ICategoryTranslation, CategoryTranslationDto>(CategoryTranslationDto);