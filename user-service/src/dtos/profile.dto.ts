import { Expose } from 'class-transformer';

export class ProfileDto {
  @Expose() _id!: string;
  @Expose() userId!: number;
  @Expose() fullName?: string;
  @Expose() birthday?: Date;
  @Expose() avatar?: string;
  @Expose() bio?: string;
  @Expose() location?: string;
  @Expose() updatedAt?: Date;
}