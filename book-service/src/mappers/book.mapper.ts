import { Types } from "mongoose";
import { BookDto } from "src/dtos/book.dto";
import { IBook } from "src/models/book.model";
import { IBookTranslation } from "src/models/bookTranslation.model";;

export function mapToBookDto(
    book: IBook,
    translation?: IBookTranslation,
    lang?: string
): BookDto {
  return  {
    _id: (book._id as Types.ObjectId).toString(),
    slug: book.slug,
    authorIds: book.authorIds ? book.authorIds.map(id => id.toString()) : [],
    categoryIds: book.categoryIds ? book.categoryIds.map(id => id.toString()) : [],
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
    updatedBy: book.updatedBy ? (book.updatedBy as Types.ObjectId).toString() : undefined,
    // Translation fields
    lang: translation?.lang ?? lang ?? "",
    title: translation?.title ?? "",
    subtitle: translation?.subtitle,
    description: translation?.description,
  }
}