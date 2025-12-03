import { Expose } from "class-transformer";
import { CategoryTranslationDto } from "./category-translation.dto";

export class CategoryDto {
  @Expose() _id!: string;
  @Expose() slug?: string;
  @Expose() parentId?: string;
  @Expose() createdAt?: Date;
  @Expose() updatedAt?: Date;
  @Expose() translations?: CategoryTranslationDto[];
}