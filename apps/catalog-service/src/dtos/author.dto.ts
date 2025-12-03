import { Expose } from "class-transformer";

export class AuthorDto {
  @Expose() _id!: string;
  @Expose() name!: string;
  @Expose() avatarUrl?: string;
  @Expose() birthDate?: Date;
  @Expose() nationality?: string;
  @Expose() bio?: string;
  @Expose() createdAt?: Date;
  @Expose() updatedAt?: Date;
}