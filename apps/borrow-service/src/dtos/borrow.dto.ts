import { Expose, Type } from "class-transformer";
import { Book, User } from "src/types";

export class BorrowDto {
  @Expose() _id!: string;
  @Expose() userId!: string;
  @Expose() itemId!: string;
  @Expose() count!: number;
  @Expose() borrowTime!: Date;
  @Expose() expireTime!: Date;
  @Expose() returnTime?: Date;
  @Expose() note?: string;
  @Expose() status!: string;
  @Expose() createdAt?: Date;
  @Expose() updatedAt?: Date;
  
  @Expose()
  @Type(() => Object)
  borrower?: User;

  @Expose()
  @Type(() => Object)
  item?: Book;
}