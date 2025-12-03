import BookRepository from "src/repositories/book.repository";
import { BaseService } from "src/core/base.service";
import { BookDto } from "src/dtos/book.dto";
import { IBook } from "src/models/book.model";
import { ICategory } from "src/models/category.model";
import { ICategoryTranslation } from "src/models/category-translation.model";
import { BookMapper } from "src/mappers/book.mapper";
import { AuthorMapper } from "src/mappers/author.mapper";
import { CategoryMapper } from "src/mappers/category.mapper";
import CategoryRepository from "src/repositories/category.repository";
import { Types } from "mongoose";
import { Pagination } from "src/types";

class BookService extends BaseService<IBook, BookDto> {

  constructor() {
    super(BookRepository, BookMapper);
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

  async findAll(lang?: string): Promise<BookDto[]> {
    const books = await BookRepository.findAll(lang);
    return books.map(book => this.mapBookToDto(book));
  }

  async findById(id: string, lang?: string): Promise<BookDto | null> {
    const book = await BookRepository.findById(id, lang);
    if (!book) return null;
    return this.mapBookToDto(book);
  }

  async findByCategory(categorySlug: string, lang?: string): Promise<BookDto[]> {
    const category = await CategoryRepository.findOne({ slug: categorySlug }) as ICategory | null;
    if (!category) return [];
    
    const categoryId = (category._id as Types.ObjectId).toString();
    const books = await BookRepository.findByCategory(categoryId, lang);
    return books.map(book => this.mapBookToDto(book));
  }

  async search(params: { [key: string]: any }): Promise<{ data: BookDto[]; pagination: Pagination }> {
    const result = await BookRepository.search(params);
    const data = (result.items || []).map(book => this.mapBookToDto(book));

    return {
      data,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        pages: result.pages
      }
    };
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