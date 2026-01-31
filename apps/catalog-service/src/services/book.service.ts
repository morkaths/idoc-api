import { BaseService } from '@libs/core';
import { ExcelService, ExcelColumn } from '@libs/excel';
import { BookDto } from "src/dtos/book.dto";
import { IBook } from "src/models/book.model";
import { ICategory } from "src/models/category.model";
import { BookMapper } from "src/mappers/book.mapper";
import { AuthorMapper } from "src/mappers/author.mapper";
import { CategoryMapper } from "src/mappers/category.mapper";
import { bookRepository } from "src/repositories/book.repository";
import { categoryRepository } from "src/repositories/category.repository";
import { authorRepository } from "src/repositories/author.repository";
import { Pagination } from "src/types";

class BookService extends BaseService<IBook, BookDto> {
  constructor() {
    super(bookRepository, BookMapper);
  }

  private mapBookToDto(book: any): BookDto {
    return BookMapper.toDto(
      book,
      book.categories?.map((category: any) =>
        CategoryMapper.toDto(category, category.translation)
      ) ?? [],
      book.authors?.map(AuthorMapper.toDto) ?? []
    );
  }

  async findList(
    page: number,
    limit: number,
    filter: { [key: string]: any }
  ): Promise<{ data: BookDto[]; pagination: Pagination }> {
    const result = await bookRepository.findList(page, limit, filter);
    const data = (result.items || []).map(book => this.mapBookToDto(book));

    return { data, pagination: result.pagination };
  }

  async findById(id: string, lang?: string): Promise<BookDto | null> {
    const book = await bookRepository.findById(id, lang);
    if (!book) return null;
    return this.mapBookToDto(book);
  }

  async findByIds(ids: string[]): Promise<BookDto[]> {
    if (!ids || ids.length === 0) return [];
    const books = await bookRepository.findByIds(ids);
    return books.map((book) => this.mapBookToDto(book));
  }

  async findByCategory(slug: string, lang?: string): Promise<BookDto[]> {
    const category = await categoryRepository.findOne({ slug }) as ICategory | null;
    if (!category) return [];
    const books = await bookRepository.findByCategory(category._id.toString(), lang);
    return books.map(book => this.mapBookToDto(book));
  }

  async importExcel(buffer: Buffer, userId?: string): Promise<{ total: number; success: number; errors: any[] }> {
    const excelService = new ExcelService();
    const rows = await excelService.readExcel<any>(buffer);

    if (!rows || rows.length === 0) {
      throw new Error('No data found in Excel file');
    }

    const errors: any[] = [];
    const validBooks: Partial<BookDto>[] = [];

    // Helper functions
    const getValue = (row: any, key: string) => excelService.getCellValue(row, key);
    const splitValues = (val: string) => val ? val.split(',').map(s => s.trim()).filter(Boolean) : [];

    const buildBookDto = (row: any, authorMap: Map<string, string>, categoryMap: Map<string, string>): Partial<BookDto> => {
      const bookDto: Partial<BookDto> = {
        title: getValue(row, 'title'),
        slug: getValue(row, 'slug') || undefined,
        description: getValue(row, 'description'),
        publisher: getValue(row, 'publisher'),
        publishedDate: getValue(row, 'published date') ? new Date(getValue(row, 'published date')) : undefined,
        edition: getValue(row, 'edition'),
        isbn: getValue(row, 'isbn'),
        language: getValue(row, 'language'),
        pages: getValue(row, 'pages') ? Number(getValue(row, 'pages')) : 0,
        price: getValue(row, 'price') ? Number(getValue(row, 'price')) : 0,
        stock: getValue(row, 'stock') ? Number(getValue(row, 'stock')) : 0,
        coverUrl: getValue(row, 'cover url'),
        tags: splitValues(getValue(row, 'tags')),
        updatedBy: userId,
      };

      // Map Authors
      const rawAuthors = splitValues(getValue(row, 'authors'));
      if (rawAuthors.length > 0) {
        const authorIds = rawAuthors
          .map(name => authorMap.get(name.toLowerCase()))
          .filter((id): id is string => !!id);
        if (authorIds.length > 0) {
          bookDto.authorIds = Array.from(new Set(authorIds));
        }
      }

      // Map Categories
      const rawCategories = splitValues(getValue(row, 'categories'));
      if (rawCategories.length > 0) {
        const cateIds = rawCategories
          .map(slug => categoryMap.get(slug.toLowerCase()))
          .filter((id): id is string => !!id);
        if (cateIds.length > 0) {
          bookDto.categoryIds = Array.from(new Set(cateIds));
        }
      }
      
      return bookDto;
    };

    // 1. Extraction
    const authorNames = new Set<string>();
    const categoryIdents = new Set<string>();
    const isbnSet = new Set<string>();
    const validRows: { row: any; index: number }[] = [];

    rows.forEach((row, index) => {
      const title = getValue(row, 'title');
      if (!title) {
        errors.push({ row: index + 2, error: 'Title is required' });
        return;
      }

      splitValues(getValue(row, 'authors')).forEach(n => authorNames.add(n));
      splitValues(getValue(row, 'categories')).forEach(c => categoryIdents.add(c));
      
      const isbn = getValue(row, 'isbn');
      if (isbn) isbnSet.add(isbn);

      validRows.push({ row, index });
    });

    // 2. Parallel Bulk Lookup
    const authorPromise = authorNames.size > 0
      ? authorRepository.find({
          $or: Array.from(authorNames).map(name => ({
            name: { $regex: new RegExp(`^${name}$`, 'i') }
          }))
        })
      : Promise.resolve([]);

    const categoryPromise = categoryIdents.size > 0
      ? categoryRepository.find({ slug: { $in: Array.from(categoryIdents) } })
      : Promise.resolve([]);

    const bookPromise = isbnSet.size > 0
      ? bookRepository.find({ isbn: { $in: Array.from(isbnSet) } })
      : Promise.resolve([]);

    const [authors, categories, existingBooks] = await Promise.all([authorPromise, categoryPromise, bookPromise]);

    const authorMap = new Map(authors.map(a => [a.name.toLowerCase(), a._id.toString()]));
    const categoryMap = new Map(categories.map(c => [c.slug.toLowerCase(), c._id.toString()]));
    const existingIsbnSet = new Set(existingBooks.map((b: IBook) => b.isbn));

    // 3. Construction
    for (const { row, index } of validRows) {
      try {
        const isbn = getValue(row, 'isbn');
        if (isbn && existingIsbnSet.has(isbn)) {
             errors.push({ row: index + 2, error: `Duplicate ISBN: ${isbn}` });
             continue;
        }

        const bookDto = buildBookDto(row, authorMap, categoryMap);
        validBooks.push(bookDto);
      } catch (error: any) {
        errors.push({ row: index + 2, error: error.message });
      }
    }

    // 4. Bulk Insert
    let successCount = 0;
    if (validBooks.length > 0) {
      try {
        await this.createMany(validBooks);
        successCount = validBooks.length;
      } catch (error: any) {
        throw new Error(`Bulk insert error: ${error.message}`);
      }
    }

    return {
      total: rows.length,
      success: successCount,
      errors
    };
  }

  async exportExcel(filters: any): Promise<Buffer> {
    const { data } = await this.findList(1, 1000, filters);

    const columns: ExcelColumn[] = [
      { header: 'Title', key: 'title' },
      { header: 'Slug', key: 'slug' },
      { header: 'Description', key: 'description' },
      { header: 'Authors', key: 'authors' },
      { header: 'Categories', key: 'categories' },
      { header: 'Publisher', key: 'publisher' },
      { header: 'Published Date', key: 'publishedDate' },
      { header: 'Edition', key: 'edition' },
      { header: 'ISBN', key: 'isbn' },
      { header: 'Language', key: 'language' },
      { header: 'Pages', key: 'pages' },
      { header: 'Price', key: 'price' },
      { header: 'Stock', key: 'stock' },
      { header: 'Cover URL', key: 'coverUrl' },
      { header: 'Tags', key: 'tags' },
    ];

    const excelData = data.map(book => ({
      title: book.title,
      description: book.description,
      authors: book.authors?.map(a => a.name).join(', ') || '',
      categories: book.categories?.map(c => c.slug).join(', ') || '',
      publisher: book.publisher,
      publishedDate: book.publishedDate ? new Date(book.publishedDate).toISOString().split('T')[0] : '',
      edition: book.edition,
      isbn: book.isbn,
      language: book.language,
      pages: book.pages,
      price: book.price,
      stock: book.stock,
      coverUrl: book.coverUrl,
      tags: book.tags?.join(', ') || '',
    }));

    const excelService = new ExcelService();
    return excelService.generateExcel(columns, excelData, 'Books');
  }

};

export default new BookService();