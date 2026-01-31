import { Expose, Type } from "class-transformer";
import { CategoryTranslationDto } from "./category-translation.dto";

export class CategoryDto {
  @Expose({ name: '_id' }) id!: string;
  @Expose() slug!: string;
  @Expose() parentId?: string;
  @Expose() createdAt?: Date;
  @Expose() updatedAt?: Date;

  @Expose()
  @Type(() => CategoryTranslationDto)
  translations?: CategoryTranslationDto[];
}