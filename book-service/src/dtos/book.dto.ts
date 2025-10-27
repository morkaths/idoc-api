import { Expose } from "class-transformer";

export class BookDto {
  @Expose() _id!: string;
  @Expose() slug?: string;
  @Expose() authorIds!: string[];
  @Expose() categoryIds!: string[];
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
  @Expose() updatedBy?: string;

  // Translation fields
  @Expose() lang!: string;
  @Expose() title!: string;
  @Expose() subtitle?: string;
  @Expose() description?: string;
}