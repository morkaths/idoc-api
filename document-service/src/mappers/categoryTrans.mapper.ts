import { createClassTransformerMapper } from "../core/base.mapper";
import { ICategoryTranslation } from "../models/categoryTranslation.model";
import { CategoryTranslationDto } from "../dtos/categoryTrans.dto";

export const CategoryTransMapper = createClassTransformerMapper<ICategoryTranslation, CategoryTranslationDto>(CategoryTranslationDto);