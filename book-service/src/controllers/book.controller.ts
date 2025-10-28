import { Request, Response } from 'express';
import BookService from '../services/book.service';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../types/request';
import * as response from '../utils/response.util';

const BookController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const { lang } = req.query;
    const books = await BookService.findAllWithCategoryTrans(
      typeof lang === 'string' ? lang : undefined
    );
    if (!books || books.length === 0) {
      return response.sendNotFoundResponse(res, 'No books found');
    }
    response.sendSuccessResponse(res, 'Get all books successfully', books);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { lang } = req.query;
    const book = await BookService.findByIdWithCategoryTrans(
      id,
      typeof lang === 'string' ? lang : undefined
    );
    if (!book) {
      return response.sendNotFoundResponse(res, 'Book not found');
    }
    response.sendSuccessResponse(res, 'Get book successfully', book);
  }),

  getByCategory: asyncHandler(async (req: Request, res: Response) => {
    const { categoryName } = req.params;
    const { lang } = req.query;
    const books = await BookService.findByCategoryNameWithCategoryTrans(
      categoryName,
      typeof lang === 'string' ? lang : undefined
    );
    if (!books || books.length === 0) {
      return response.sendNotFoundResponse(res, 'No books found for this category');
    }
    response.sendSuccessResponse(res, 'Get books by category successfully', books);
  }),

  search: asyncHandler(async (req: Request, res: Response) => {
    const { query, lang } = req.query;
    if (!query || typeof query !== 'string') {
      return response.sendErrorResponse(res, 'Invalid search query parameter');
    }
    const books = await BookService.searchWithCategoryTrans(
      query,
      typeof lang === 'string' ? lang : undefined
    );
    if (!books || books.length === 0) {
      return response.sendNotFoundResponse(res, 'No books found for this search query');
    }
    response.sendSuccessResponse(res, 'Search books successfully', books);
  }),

  create: asyncHandler(async (req: AuthRequest, res: Response) => {
    const bookDto = req.body;
    if (req.user && req.user.id) {
      bookDto.updatedBy = req.user.id;
    }
    const book = await BookService.create(bookDto);
    response.sendSuccessResponse(res, 'Book created successfully', book);
  }),

  update: asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const bookDto = req.body;
    if (req.user && req.user.id) {
      bookDto.updatedBy = req.user.id;
    }
    const book = await BookService.update(id, bookDto);
    if (!book) {
      return response.sendNotFoundResponse(res, 'Book not found');
    }
    response.sendSuccessResponse(res, 'Book updated successfully', book);
  }),

  delete: asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const result = await BookService.delete(id);
    if (!result) {
      return response.sendNotFoundResponse(res, 'Book not found');
    }
    response.sendSuccessResponse(res, 'Book deleted successfully');
  }),

};

export default BookController;