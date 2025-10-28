import { Expose } from "class-transformer";
import { CategoryDto } from "./category.dto";
import { AuthorDto } from "./author.dto";

export class BookDto {
  @Expose() _id!: string;
  @Expose() title!: string;
  @Expose() subtitle?: string;
  @Expose() description?: string;
  @Expose() slug?: string;
  @Expose() publisher?: string;
  @Expose() publishedDate?: Date;
  @Expose() edition?: string;
  @Expose() isbn?: string;
  @Expose() language?: string;
  @Expose() pages?: number;
  @Expose() format?: string;
  @Expose() price?: number;
  @Expose() currency?: string;
  @Expose() stock?: number;
  @Expose() coverUrl?: string;
  @Expose() tags?: string[];
  @Expose() createdAt?: Date;
  @Expose() updatedAt?: Date;
  @Expose() updatedBy?: number;
  @Expose() categories?: CategoryDto[];
  @Expose() authors?: AuthorDto[];
}