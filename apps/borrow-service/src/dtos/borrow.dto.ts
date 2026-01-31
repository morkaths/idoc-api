import { Expose, Type } from "class-transformer";
import { Book, User } from "src/types";

export class RenewalDto {
  @Expose() renewedAt!: Date;
  @Expose() oldExpireTime!: Date;
  @Expose() newExpireTime!: Date;
}

export class BorrowDto {
  @Expose({ name: '_id' }) id!: string;
  @Expose() userId!: string;
  @Expose() itemId!: string;
  @Expose() borrowTime!: Date;
  @Expose() expireTime!: Date;
  @Expose() returnTime?: Date;
  @Expose() note?: string;
  @Expose() status!: string;
  @Expose() createdAt?: Date;
  @Expose() updatedAt?: Date;

  @Expose()
  @Type(() => RenewalDto)
  renewals!: RenewalDto[];

  @Expose()
  @Type(() => Object)
  borrower?: User;

  @Expose()
  @Type(() => Object)
  item?: Book;
}