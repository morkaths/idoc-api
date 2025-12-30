import { createClassTransformerMapper } from "../core/base.mapper";
import { IFile } from "../models/file.model";
import { FileDto } from "../dtos/file.dto";

// Sử dụng class-transformer để map giữa entity và DTO
export const fileMapper = createClassTransformerMapper<IFile, FileDto>(FileDto);