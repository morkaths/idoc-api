import { createClassTransformerMapper } from "../core/base.mapper";
import { IFileMetadata } from "../models/file-metadata.model";
import { FileMetadataDto } from "../dtos/file-metadata.dto";

// Sử dụng class-transformer để map giữa entity và DTO
export const fileMetadataMapper = createClassTransformerMapper<IFileMetadata, FileMetadataDto>(FileMetadataDto);