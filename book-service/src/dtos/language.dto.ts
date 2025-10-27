import { Expose } from "class-transformer";

export class LanguageDto {
  @Expose() _id!: string;
  @Expose() code!: string;
  @Expose() name!: string;
  @Expose() nativeName?: string;
  @Expose() isDefault?: boolean;
  @Expose() isActive?: boolean;
  @Expose() createdAt?: Date;
  @Expose() updatedAt?: Date;
}