import { Types } from "mongoose";
import { CategoryDto } from "../dtos/category.dto";
import { ICategory } from "../models/category.model";
import { ICategoryTranslation } from "../models/categoryTranslation.model";

/**
 * Maps a category and its translation to a CategoryDto.
 * @param category - The category entity
 * @param translation - The category translation entity
 * @param lang - The language code
 * @returns The mapped CategoryDto
 */
export function mapToCategoryDto(
  category: ICategory,
  translation?: ICategoryTranslation,
  lang?: string
): CategoryDto {
  return {
    _id: (category._id as Types.ObjectId).toString(),
    slug: category.slug,
    parentId: category.parentId ? (category.parentId as Types.ObjectId).toString() : undefined,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
    // Translation fields
    lang: translation?.lang ?? lang ?? "",
    name: translation?.name ?? "",
    description: translation?.description ?? "",
  };
}