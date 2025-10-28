import { Types } from "mongoose";
import { BookDto } from "src/dtos/book.dto";
import { IBook } from "src/models/book.model";
import { CategoryDto } from "src/dtos/category.dto";
import { AuthorDto } from "src/dtos/author.dto";

export const BookMapper = {
  toDto(
    book: IBook,
    categories?: CategoryDto[],
    authors?: AuthorDto[]
  ): BookDto {
    return {
      _id: (book._id as Types.ObjectId).toString(),
      title: book.title,
      subtitle: book.subtitle,
      description: book.description,
      slug: book.slug,
      publisher: book.publisher,
      publishedDate: book.publishedDate,
      edition: book.edition,
      isbn: book.isbn,
      language: book.language,
      pages: book.pages,
      format: book.format,
      price: book.price,
      currency: book.currency,
      stock: book.stock,
      coverUrl: book.coverUrl,
      tags: book.tags ?? [],
      createdAt: book.createdAt,
      updatedAt: book.updatedAt,
      updatedBy: book.updatedBy,
      categories: categories ?? [],
      authors: authors ?? [],
    }
  },
  
  toEntity(dto: BookDto): IBook {
    return {
      title: dto.title ?? "",
      subtitle: dto.subtitle,
      description: dto.description,
      slug: dto.slug,
      publisher: dto.publisher,
      publishedDate: dto.publishedDate,
      edition: dto.edition,
      isbn: dto.isbn,
      language: dto.language,
      pages: dto.pages,
      format: dto.format,
      price: dto.price,
      currency: dto.currency,
      stock: dto.stock,
      coverUrl: dto.coverUrl,
      tags: dto.tags,
      updatedBy: dto.updatedBy,
      authorIds: dto.authors?.map(a => new Types.ObjectId(a._id)) ?? [],
      categoryIds: dto.categories?.map(c => new Types.ObjectId(c._id)) ?? [],
    } as IBook;
  },
  toDtos(books: IBook[]): BookDto[] {
    return books.map(book => BookMapper.toDto(book));
  },
  toEntities(dtos: BookDto[]): IBook[] {
    return dtos.map(dto => BookMapper.toEntity(dto));
  }
};