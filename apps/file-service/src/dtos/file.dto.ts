import { Expose } from "class-transformer";

export class FileDto {
  @Expose() id!: string;
  @Expose() filename!: string;
  @Expose() originalName!: string;
  @Expose() mimeType!: string;
  @Expose() size!: number;
  @Expose() path!: string;
  @Expose() url!: string;
  @Expose() provider?: string;
  @Expose() metadata?: Record<string, any>;
  @Expose() uploadedBy?: string;
  @Expose() createdAt?: Date;
  @Expose() updatedAt?: Date;
}