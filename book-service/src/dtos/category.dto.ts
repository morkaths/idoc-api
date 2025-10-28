import { Expose } from "class-transformer";
import { CategoryTranslationDto } from "./categoryTrans.dto";

export class CategoryDto {
  @Expose() _id!: string;
  @Expose() slug?: string;
  @Expose() parentId?: string;
  @Expose() createdAt?: Date;
  @Expose() updatedAt?: Date;
  @Expose() translation?: CategoryTranslationDto;
}