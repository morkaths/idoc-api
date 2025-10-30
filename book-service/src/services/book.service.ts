import BookRepository from "src/repositories/book.repository";
import { BaseService } from "src/core/base.service";
import { BookDto } from "src/dtos/book.dto";
import { IBook } from "src/models/book.model";
import { ICategory } from "src/models/category.model";
import { ICategoryTranslation } from "src/models/categoryTranslation.model";
import { BookMapper } from "src/mappers/book.mapper";
import { AuthorMapper } from "src/mappers/author.mapper";
import { CategoryMapper } from "src/mappers/category.mapper";
import CategoryRepository from "src/repositories/category.repository";
import { Types } from "mongoose";

class BookService extends BaseService<IBook, BookDto> {

  constructor() {
    super(BookRepository, BookMapper);
  }

  async findAllWithCategoryTrans(lang?: string): Promise<BookDto[]> {
    const books = await BookRepository.findAll(lang);
    return books.map(book =>
      BookMapper.toDto(
        book,
        book.categories.map((category: ICategory & { translation?: ICategoryTranslation }) =>
          CategoryMapper.toDto(category, category.translation)
        ),
        book.authors ? book.authors.map(AuthorMapper.toDto) : []
      )
    );
  }

  async findByIdWithCategoryTrans(id: string, lang?: string): Promise<BookDto | null> {
    const book = await BookRepository.findById(id, lang);
    if (!book) return null;
    return BookMapper.toDto(
      book,
      book.categories.map((category: ICategory & { translation?: ICategoryTranslation }) =>
        CategoryMapper.toDto(category, category.translation)
      ),
      book.authors ? book.authors.map(AuthorMapper.toDto) : []
    );
  }

  async findByCategoryNameWithCategoryTrans(categoryName: string, lang?: string): Promise<BookDto[]> {
    const category = await CategoryRepository.findOne({ name: categoryName }) as ICategory | null;
    if (!category) return [];
    const categoryId = (category._id as Types.ObjectId).toString();
    const books = await BookRepository.findByCategory(categoryId, lang);
    return books.map(book =>
      BookMapper.toDto(
        book,
        book.categories.map((category: ICategory & { translation?: ICategoryTranslation }) =>
          CategoryMapper.toDto(category, category.translation)
        ),
        book.authors ? book.authors.map(AuthorMapper.toDto) : []
      )
    );
  }

  async searchWithCategoryTrans(query: string, lang?: string): Promise<BookDto[]> {
    const books = await BookRepository.search(query, lang);
    return books.map(book =>
      BookMapper.toDto(
        book,
        book.categories.map((category: ICategory & { translation?: ICategoryTranslation }) =>
          CategoryMapper.toDto(category, category.translation)
        ),
        book.authors ? book.authors.map(AuthorMapper.toDto) : []
      )
    );
  }

  async create(bookDto: BookDto): Promise<BookDto> {
    const entity = BookMapper.toEntity(bookDto);
    const book = await BookRepository.create(entity);
    return BookMapper.toDto(book);
  }

  async update(id: string, bookDto: BookDto): Promise<BookDto | null> {
    const entity = BookMapper.toEntity(bookDto);
    const book = await BookRepository.update(id, entity);
    return book ? BookMapper.toDto(book) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await BookRepository.delete(id);
    return !!result;
  }
};

export default new BookService();