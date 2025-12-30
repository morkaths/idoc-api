import { Types } from "mongoose";
import { FileDto } from "src/dtos/file.dto";
import { IDocument } from "src/models/document.model";
import { CategoryDto } from "src/dtos/category.dto";
import { BaseMapper, createClassTransformerMapper } from "src/core/base.mapper";

const baseDocumentMapper = createClassTransformerMapper<IDocument, FileDto>(FileDto);

export const DocumentMapper: BaseMapper<IDocument, FileDto> & {
  toDto(file: IDocument, categories?: CategoryDto[]): FileDto;
} = {
  toDto(file: IDocument, categories?: CategoryDto[]): FileDto {
    const baseDto = baseDocumentMapper.toDto(file);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { categoryIds, ...cleanDto } = baseDto;
    return {
      ...cleanDto,
      categories: categories ?? []
    };
  },

  toEntity(dto: Partial<FileDto>): Partial<IDocument> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { categories, ...cleanDto } = dto;
    const baseEntity = baseDocumentMapper.toEntity(cleanDto);
    const result: Partial<IDocument> = { ...baseEntity };

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