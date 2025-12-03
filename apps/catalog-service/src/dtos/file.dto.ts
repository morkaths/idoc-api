import { Expose } from "class-transformer";
import { CategoryDto } from "./category.dto";

export class FileDto {
  @Expose() _id!: string;
  @Expose() title!: string;
  @Expose() slug?: string;
  @Expose() description?: string;
  @Expose() categoryIds?: string[];
  @Expose() categories?: CategoryDto[];
  @Expose() language?: string;
  @Expose() kind?: string; // e.g. 'pdf' | 'epub' | 'audiobook'
  @Expose() coverUrl?: string;
  @Expose() fileUrls?: string[];
  @Expose() metadata?: any;
  @Expose() access?: string; // e.g. 'free' | 'premium'
  @Expose() updatedBy?: string; // user id (string from user-service)
  @Expose() createdAt?: Date;
  @Expose() updatedAt?: Date;
}