import { Expose } from "class-transformer";

export class CategoryDto {
  @Expose() _id!: string;
  @Expose() slug?: string;
  @Expose() parentId?: string;
  @Expose() name!: string;
  @Expose() description?: string;
  @Expose() lang!: string;
  @Expose() createdAt?: Date;
  @Expose() updatedAt?: Date;
}