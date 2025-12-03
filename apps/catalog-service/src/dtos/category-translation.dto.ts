import { Expose } from "class-transformer";

export class CategoryTranslationDto {
  @Expose() lang!: string;
  @Expose() name!: string;
  @Expose() description?: string;
  @Expose() createdAt?: Date;
  @Expose() updatedAt?: Date;
}