import { Expose } from "class-transformer";

export class FileDto {
  @Expose({ name: '_id' }) id!: string;
  @Expose() key!: string;
  @Expose() filename!: string;
  @Expose() mimeType!: string;
  @Expose() type!: string;
  @Expose() size!: number;
  @Expose() url!: string;
  @Expose() provider?: string;
  @Expose() metadata?: Record<string, any>;
  @Expose() uploadedBy?: string;
  @Expose() createdAt?: Date;
  @Expose() updatedAt?: Date;
}