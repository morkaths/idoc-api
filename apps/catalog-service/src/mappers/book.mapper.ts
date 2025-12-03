import { Types } from "mongoose";
import { BookDto } from "src/dtos/book.dto";
import { IBook } from "src/models/book.model";
import { CategoryDto } from "src/dtos/category.dto";
import { AuthorDto } from "src/dtos/author.dto";
import { BaseMapper, createClassTransformerMapper } from "src/core/base.mapper";

const baseBookMapper = createClassTransformerMapper<IBook, BookDto>(BookDto);

export const BookMapper: BaseMapper<IBook, BookDto> & {
  toDto(book: IBook, categories?: CategoryDto[], authors?: AuthorDto[]): BookDto;
} = {
  toDto(
    book: IBook,
    categories?: CategoryDto[],
    authors?: AuthorDto[]
  ): BookDto {
    const baseDto = baseBookMapper.toDto(book);
    const { authorIds, categoryIds, ...cleanDto } = baseDto;
    return {
      ...cleanDto,
      categories: categories ?? [],
      authors: authors ?? [],
    }
  },
  toEntity(dto: Partial<BookDto>): Partial<IBook> {
    const { categories, authors, ...cleanDto } = dto;
    const baseEntity = baseBookMapper.toEntity(cleanDto);
    const result: Partial<IBook> = { ...baseEntity };
    if (dto.authorIds !== undefined) {
      result.authorIds = dto.authorIds?.map(id => new Types.ObjectId(id)) ?? [];
    }
    if (dto.categoryIds !== undefined) {
      result.categoryIds = dto.categoryIds?.map(id => new Types.ObjectId(id)) ?? [];
    }
    return result;
  }
};