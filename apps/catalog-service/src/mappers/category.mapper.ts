import { Types } from "mongoose";
import { CategoryDto } from "../dtos/category.dto";
import { ICategory } from "../models/category.model";
import { ICategoryTranslation } from "../models/category-translation.model";
import { CategoryTransMapper } from "./category-translation.mapper";
import { BaseMapper, createClassTransformerMapper } from "src/core/base.mapper";

const baseCategoryMapper = createClassTransformerMapper<ICategory, CategoryDto>(CategoryDto);

export const CategoryMapper: BaseMapper<ICategory, CategoryDto> & {
  toDto(category: ICategory, translation?: ICategoryTranslation[]): CategoryDto;
} = {
  toDto(
    category: ICategory,
    translation?: ICategoryTranslation[]
  ): CategoryDto {
    const baseDto = baseCategoryMapper.toDto(category);

    let translationsArray: ICategoryTranslation[] = [];
    if (Array.isArray(translation)) {
      translationsArray = translation;
    } else if (translation) {
      translationsArray = [translation];
    }
    return {
      ...baseDto,
      translations: translationsArray.map(t => CategoryTransMapper.toDto(t)),
    };
  },
  toEntity(dto: Partial<CategoryDto>): Partial<ICategory> {
    const { translations, ...cleanDto } = dto;
    const baseEntity = baseCategoryMapper.toEntity(cleanDto);
    const result: Partial<ICategory> = { ...baseEntity };
    return result;
  }
};