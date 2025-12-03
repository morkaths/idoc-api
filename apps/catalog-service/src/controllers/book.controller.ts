import { Request, Response } from 'express';
import BookService from '../services/book.service';
import { asyncHandler } from '../middleware/error-handler';
import { AuthRequest } from '../types/request';
import * as response from '../utils/response.util';

const BookController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const {data, pagination} = await BookService.search(req.query);
    if (!data || data.length === 0) {
      return response.notFound(res, 'No books found');
    }
    response.paginated(res, 'Get all books successfully', data, pagination);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const lang = typeof req.query.lang === 'string' ? req.query.lang : undefined;
    const book = await BookService.findById(id, lang);
    if (!book) {
      return response.notFound(res, 'Book not found');
    }
    response.success(res, 'Get book successfully', book);
  }),

  getByCategory: asyncHandler(async (req: Request, res: Response) => {
    const { categorySlug } = req.params;
    const lang = typeof req.query.lang === 'string' ? req.query.lang : undefined;
    const books = await BookService.findByCategory( categorySlug, lang);
    if (!books || books.length === 0) {
      return response.notFound(res, 'No books found for this category');
    }
    response.success  (res, 'Get books by category successfully', books);
  }),

  search: asyncHandler(async (req: Request, res: Response) => {
    const {data, pagination} = await BookService.search(req.query);
    if (!data || data.length === 0) {
      return response.notFound(res, 'No books found for this search query');
    }
    response.paginated(res, 'Search books successfully', data, pagination);
  }),

  create: asyncHandler(async (req: AuthRequest, res: Response) => {
    const bookDto = req.body;
    if (req.user && req.user.id) {
      bookDto.updatedBy = req.user.id;
    }
    const book = await BookService.create(bookDto);
    response.created(res, 'Book created successfully', book);
  }),

  update: asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const bookDto = req.body;
    if (req.user && req.user.id) {
      bookDto.updatedBy = req.user.id;
    }
    const book = await BookService.update(id, bookDto);
    if (!book) {
      return response.notFound(res, 'Book not found');
    }
    response.updated(res, 'Book updated successfully', book);
  }),

  delete: asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const result = await BookService.delete(id);
    if (!result) {
      return response.notFound(res, 'Book not found');
    }
    response.deleted(res, 'Book deleted successfully');
  }),

};

export default BookController;