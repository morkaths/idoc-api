import { Types } from "mongoose";
import { FileDto } from "src/dtos/file.dto";
import { IFile } from "src/models/file.model";
import { CategoryDto } from "src/dtos/category.dto";
import { BaseMapper, createClassTransformerMapper } from "src/core/base.mapper";

const baseFileMapper = createClassTransformerMapper<IFile, FileDto>(FileDto);

export const FileMapper: BaseMapper<IFile, FileDto> & {
  toDto(file: IFile, categories?: CategoryDto[]): FileDto;
} = {
  toDto(file: IFile, categories?: CategoryDto[]): FileDto {
    const baseDto = baseFileMapper.toDto(file);
    const { categoryIds, ...cleanDto } = baseDto;
    return {
      ...cleanDto,
      categories: categories ?? []
    };
  },

  toEntity(dto: Partial<FileDto>): Partial<IFile> {
    const { categories, ...cleanDto } = dto;
    const baseEntity = baseFileMapper.toEntity(cleanDto);
    const result: Partial<IFile> = { ...baseEntity };

    if (dto.categoryIds !== undefined) {
      result.categoryIds = dto.categoryIds?.map(id => new Types.ObjectId(id)) ?? [];
    }

    if (dto.updatedBy !== undefined) {
      // keep as number if it's numeric string, otherwise keep raw (adapt if you change user id type)
      const ub = dto.updatedBy as any;
      result.updatedBy = typeof ub === "string" && /^\d+$/.test(ub) ? Number(ub) : (ub as any);
    }

    return result;
  }
};