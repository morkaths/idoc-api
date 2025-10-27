import BookRepository from "src/repositories/book.repository";
import BookTransRepository from "src/repositories/bookTrans.repository";
import { mapToBookDto } from "src/mappers/book.mapper";
import { BookDto } from "src/dtos/book.dto";
import { Types } from "mongoose";
import { joinWithTranslation } from "src/core/join.helper";

const BookService = {
  async findAll(lang: string): Promise<BookDto[]> {
    const books = await BookRepository.findAll();
    return joinWithTranslation(
      books,
      (ids) => BookTransRepository.find({ bookId: { $in: ids }, lang }),
      (book) => (book._id as Types.ObjectId).toString(),
      (trans) => (trans.bookId as Types.ObjectId).toString(),
      (book, trans) => mapToBookDto(book, trans, lang)
    );
  },

  async getById(id: string, lang: string): Promise<BookDto | null> {
    const book = await BookRepository.findById(id);
    if (!book) throw new Error('Book not found');
    const trans = await BookTransRepository.findOne({ bookId: book._id, lang });
    if (!trans) throw new Error('Book translation not found');
    return mapToBookDto(book, trans, lang);
  },

  async search(query: any, lang: string): Promise<BookDto[]> {
    let bookIds: string[] | undefined = undefined;
    if (query.title || query.subtitle || query.description) {
      const transQuery: any = { lang };
      if (query.title) transQuery.title = { $regex: query.title, $options: 'i' };
      if (query.subtitle) transQuery.subtitle = { $regex: query.subtitle, $options: 'i' };
      if (query.description) transQuery.description = { $regex: query.description, $options: 'i' };
      const trans = await BookTransRepository.find(transQuery);
      bookIds = trans.map(t => t.bookId.toString());
    }
    const bookQuery: any = { ...query };
    delete bookQuery.title;
    delete bookQuery.subtitle;
    delete bookQuery.description;
    if (bookIds) bookQuery._id = { $in: bookIds };

    const books = await BookRepository.find(bookQuery);
    return joinWithTranslation(
      books,
      (ids) => BookTransRepository.find({ bookId: { $in: ids }, lang }),
      (book) => (book._id as Types.ObjectId).toString(),
      (trans) => (trans.bookId as Types.ObjectId).toString(),
      (book, trans) => mapToBookDto(book, trans, lang)
    );
  },

  async create(bookDto: BookDto): Promise<BookDto> {
    const { title, subtitle, description, lang, authorIds, categoryIds, updatedBy, ...bookData } = bookDto;
    const bookCreateData = {
      ...bookData,
      authorIds: authorIds ? authorIds.map(id => new Types.ObjectId(id)) : [],
      categoryIds: categoryIds ? categoryIds.map(id => new Types.ObjectId(id)) : [],
      updatedBy: updatedBy ? new Types.ObjectId(updatedBy) : undefined,
    };
    const book = await BookRepository.create(bookCreateData);
    const trans = await BookTransRepository.create({
      bookId: book._id as Types.ObjectId,
      title,
      subtitle,
      description,
      lang
    });
    return mapToBookDto(book, trans, lang);
  },

  async updateBook(id: string, data: Partial<BookDto>, lang: string): Promise<BookDto | null> {
    const { authorIds, categoryIds, updatedBy, ...bookData } = data;
    const updateData = {
      ...bookData,
      authorIds: authorIds ? authorIds.map(id => new Types.ObjectId(id)) : undefined,
      categoryIds: categoryIds ? categoryIds.map(id => new Types.ObjectId(id)) : undefined,
      updatedBy: updatedBy ? new Types.ObjectId(updatedBy) : undefined,
    };
    const book = await BookRepository.update(id, updateData);
    if (!book) return null;
    const trans = await BookTransRepository.findOne({ bookId: book._id, lang });
    return trans ? mapToBookDto(book, trans, lang) : null;
  },

  async updateTranslation(bookId: string, lang: string, data: Partial<BookDto>): Promise<BookDto | null> {
    const { title, subtitle, description } = data;
    const trans = await BookTransRepository.findOne({ bookId: new Types.ObjectId(bookId), lang });
    if (!trans) return null;
    const result = await BookTransRepository.update(trans._id as string, { title, subtitle, description });
    const updatedTrans = await BookTransRepository.findById(trans._id as string);
    const book = await BookRepository.findById(bookId);
    if (!book || !updatedTrans) return null;
    return mapToBookDto(book, updatedTrans, lang);
  },

  async delete(id: string): Promise<boolean> {
    const book = await BookRepository.findById(id);
    if (!book) throw new Error('Book not found');
    await BookTransRepository.deleteMany({ bookId: book._id });
    return BookRepository.delete(id);
  }
};

export default BookService;