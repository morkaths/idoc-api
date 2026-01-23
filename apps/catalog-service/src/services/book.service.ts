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

  async importExcel(buffer: Buffer): Promise<{ total: number; success: number; errors: any[] }> {
    const excelService = new ExcelService();
    const rows = await excelService.readExcel<any>(buffer);

    if (!rows || rows.length === 0) {
      throw new Error('No data found in Excel file');
    }

    const errors: any[] = [];
    const validBooks: Partial<BookDto>[] = [];

    // 1. Extraction & Validation
    const authorNames = new Set<string>();
    const categoryIdents = new Set<string>();
    const rowsToProcess: { row: any; index: number }[] = [];

    rows.forEach((row, index) => {
      if (!row.title) {
        errors.push({ row: index + 2, error: 'Title is required' });
        return;
      }

      if (row.authors) {
        String(row.authors).split(',').forEach(n => {
          const name = n.trim();
          if (name) authorNames.add(name);
        });
      }

      if (row.categories) {
        String(row.categories).split(',').forEach(c => {
          const ident = c.trim();
          if (ident) categoryIdents.add(ident);
        });
      }

      rowsToProcess.push({ row, index });
    });

    // 2. Bulk Loookup
    const authorMap = new Map<string, string>(); // Name (lowercase) -> ID
    const categoryMap = new Map<string, string>(); // Slug (lowercase) -> ID

    if (authorNames.size > 0) {
      const conditions = Array.from(authorNames).map(name => ({
        name: { $regex: new RegExp(`^${name}$`, 'i') }
      }));
      const authors = await authorRepository.find({ $or: conditions });
      authors.forEach(a => authorMap.set(a.name.toLowerCase(), a._id.toString()));
    }

    if (categoryIdents.size > 0) {
      const idents = Array.from(categoryIdents);
      // Lookup by Slug ONLY
      const catsBySlug = await categoryRepository.find({ slug: { $in: idents } });
      catsBySlug.forEach(c => categoryMap.set(c.slug.toLowerCase(), c._id.toString()));
    }

    // Helper to extract link value
    const getLinkValue = (val: any): string => {
      if (!val) return '';
      if (typeof val === 'object' && 'text' in val) {
        return val.text;
      }
      return String(val);
    };

    // 3. Construction
    for (const { row, index } of rowsToProcess) {
      try {
        const bookDto: Partial<BookDto> = {
          title: row.title,
          slug: row.slug,
          description: row.description,
          publisher: row.publisher,
          publishedDate: row.publishedDate ? new Date(row.publishedDate) : undefined,
          edition: row.edition?.toString(),
          isbn: row.isbn?.toString(),
          language: row.language,
          pages: row.pages ? Number(row.pages) : 0,
          price: row.price ? Number(row.price) : 0,
          stock: row.stock ? Number(row.stock) : 0,
          coverUrl: getLinkValue(row.coverUrl),
          tags: row.tags ? String(row.tags).split(',').map((t: string) => t.trim()) : [],
        };

        // Map Authors
        if (row.authors) {
          const foundIds = new Set<string>();
          String(row.authors).split(',').forEach(n => {
            const id = authorMap.get(n.trim().toLowerCase());
            if (id) foundIds.add(id);
          });
          if (foundIds.size > 0) bookDto.authorIds = Array.from(foundIds);
        }

        // Map Categories
        if (row.categories) {
          const foundIds = new Set<string>();
          String(row.categories).split(',').forEach(c => {
            const key = c.trim().toLowerCase();
            const id = categoryMap.get(key);
            if (id) foundIds.add(id);
          });
          if (foundIds.size > 0) bookDto.categoryIds = Array.from(foundIds);
        }

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
        throw new Error(`Bulk insert failed: ${error.message}`);
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
      { header: '_id', key: '_id' },
      { header: 'title', key: 'title' },
      { header: 'slug', key: 'slug' },
      { header: 'description', key: 'description' },
      { header: 'authors', key: 'authors' },
      { header: 'categories', key: 'categories' },
      { header: 'publisher', key: 'publisher' },
      { header: 'publishedDate', key: 'publishedDate' },
      { header: 'edition', key: 'edition' },
      { header: 'isbn', key: 'isbn' },
      { header: 'language', key: 'language' },
      { header: 'pages', key: 'pages' },
      { header: 'price', key: 'price' },
      { header: 'stock', key: 'stock' },
      { header: 'coverUrl', key: 'coverUrl' },
      { header: 'tags', key: 'tags' },
    ];

    const excelData = data.map((book: any) => ({
      _id: book._id?.toString(),
      title: book.title,
      description: book.description,
      authors: book.authors?.map((a: any) => a.name).join(', ') || '',
      categories: book.categories?.map((c: any) => c.slug).join(', ') || '',
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