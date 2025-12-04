import { Expose } from "class-transformer";

export class FileMetadataDto {
  @Expose() id!: string;
  @Expose() filename!: string;
  @Expose() originalName!: string;
  @Expose() mimeType!: string;
  @Expose() size!: number;
  @Expose() provider!: string;
  @Expose() uploadedBy?: string;
  @Expose() metadata?: Record<string, any>;
  @Expose() createdAt?: Date;
  @Expose() updatedAt?: Date;
  @Expose() publicUrl?: string;
}