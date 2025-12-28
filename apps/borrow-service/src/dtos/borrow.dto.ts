import { Expose } from "class-transformer";

export class BorrowerDto {
  @Expose() id!: string;
  @Expose() username!: string;
  @Expose() email!: string;
}

export class ItemDto {
  @Expose() _id!: string;
  @Expose() title!: string;
}

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
  @Expose() borrower?: BorrowerDto;
  @Expose() item?: ItemDto;
}