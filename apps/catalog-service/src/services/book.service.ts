import { BaseService } from "src/core/base.service";
import { BookDto } from "src/dtos/book.dto";
import { IBook } from "src/models/book.model";
import { ICategory } from "src/models/category.model";
import { BookMapper } from "src/mappers/book.mapper";
import { AuthorMapper } from "src/mappers/author.mapper";
import { CategoryMapper } from "src/mappers/category.mapper";
import { bookRepository } from "src/repositories/book.repository";
import { categoryRepository } from "src/repositories/category.repository";
import { Pagination } from "src/types";

class BookService extends BaseService<IBook, BookDto> {
  constructor() {
    super(bookRepository, BookMapper);
  }

  /**
   * Helper: Map book với categories và authors
   */
  private mapBookToDto(book: any): BookDto {
    return BookMapper.toDto(
      book,
      book.categories?.map((category: any) =>
        CategoryMapper.toDto(category, category.translation)
      ) ?? [],
      book.authors?.map(AuthorMapper.toDto) ?? []
    );
  }

  async getList(
    page: number,
    limit: number,
    filter: { [key: string]: any }
  ): Promise<{ data: BookDto[]; pagination: Pagination }> {
    const result = await bookRepository.findList(page, limit, filter);
    const data = (result.items || []).map(book => this.mapBookToDto(book));

    return { data, pagination: result.pagination };
  }

  async getById(id: string, lang?: string): Promise<BookDto | null> {
    const book = await bookRepository.findById(id, lang);
    if (!book) return null;
    return this.mapBookToDto(book);
  }

  async getByCategory(slug: string, lang?: string): Promise<BookDto[]> {
    const category = await categoryRepository.findOne({ slug }) as ICategory | null;
    if (!category) return [];
    const books = await bookRepository.findByCategory(category._id.toString(), lang);
    return books.map(book => this.mapBookToDto(book));
  }

  // async create(bookDto: BookDto): Promise<BookDto> {
  //   const entity = BookMapper.toEntity(bookDto);
  //   const book = await BookRepository.create(entity);
  //   return BookMapper.toDto(book);
  // }

  // async update(id: string, bookDto: BookDto): Promise<BookDto | null> {
  //   const entity = BookMapper.toEntity(bookDto);
  //   const book = await BookRepository.update(id, entity);
  //   return book ? BookMapper.toDto(book) : null;
  // }

  // async delete(id: string): Promise<boolean> {
  //   return await BookRepository.delete(id);
  // }
};

export default new BookService();