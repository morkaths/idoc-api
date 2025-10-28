import { Types } from "mongoose";
import { CategoryDto } from "../dtos/category.dto";
import { ICategory } from "../models/category.model";
import { ICategoryTranslation } from "../models/categoryTranslation.model";
import { CategoryTransMapper } from "./categoryTrans.mapper";

export const CategoryMapper = {
  toDto(
    category: ICategory,
    translation?: ICategoryTranslation
  ): CategoryDto {
    return {
      _id: (category._id as Types.ObjectId).toString(),
      slug: category.slug,
      parentId: category.parentId ? (category.parentId as Types.ObjectId).toString() : undefined,
      createdAt: category?.createdAt,
      updatedAt: category?.updatedAt,
      translation: translation ? CategoryTransMapper.toDto(translation) : undefined,
    };
  },
  toEntity(dto: CategoryDto): ICategory {
    return {
      slug: dto.slug,
      parentId: dto.parentId ? new Types.ObjectId(dto.parentId) : undefined,
    } as ICategory;
  },
  toDtos(categories: ICategory[]): CategoryDto[] {
    return categories.map(category => CategoryMapper.toDto(category));
  },
  toEntities(dtos: CategoryDto[]): ICategory[] {
    return dtos.map(dto => CategoryMapper.toEntity(dto));
  }
};