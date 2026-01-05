import { Types } from "mongoose";
import { BookDto } from "../dtos/book.dto";
import { IBook } from "../models/book.model";
import { CategoryDto } from "../dtos/category.dto";
import { AuthorDto } from "../dtos/author.dto";
import { BaseMapper, createClassTransformerMapper } from '@libs/core';

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { authorIds, categoryIds, ...cleanDto } = baseDto;
    return {
      ...cleanDto,
      categories: categories ?? [],
      authors: authors ?? [],
    }
  },
  toEntity(dto: Partial<BookDto>): Partial<IBook> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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