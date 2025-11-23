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
      price: book.price,
      stock: book.stock,
      coverUrl: book.coverUrl,
      fileUrl: book.fileUrl,
      fileType: book.fileType,
      fileSize: book.fileSize,
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
      price: dto.price,
      stock: dto.stock,
      coverUrl: dto.coverUrl,
      fileUrl: dto.fileUrl,
      fileType: dto.fileType,
      fileSize: dto.fileSize,
      tags: dto.tags,
      updatedBy: dto.updatedBy,
      authorIds: dto.authorIds?.map(id => new Types.ObjectId(id)) ?? [],
      categoryIds: dto.categoryIds?.map(id => new Types.ObjectId(id)) ?? [],
    } as IBook;
  },
  toDtos(books: IBook[]): BookDto[] {
    return books.map(book => BookMapper.toDto(book));
  },
  toEntities(dtos: BookDto[]): IBook[] {
    return dtos.map(dto => BookMapper.toEntity(dto));
  }
};