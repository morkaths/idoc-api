import { Expose } from "class-transformer";

export class CommentDto {
  @Expose() _id!: string;
  @Expose() bookId!: string;
  @Expose() userId!: string;
  @Expose() content!: string;
  @Expose() rating?: number;
  @Expose() createdAt?: Date;
  @Expose() updatedAt?: Date;
}