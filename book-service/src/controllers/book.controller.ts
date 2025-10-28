import { Request, Response } from 'express';
import BookService from '../services/book.service';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../types/request';
import * as response from '../utils/response.util';

const BookController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const { lang } = req.query;
    if (!lang || typeof lang !== 'string') {
      return response.sendErrorResponse(res, 'Invalid language parameter');
    }
    const books = await BookService.getAll(lang);
    if (!books) {
      return response.sendNotFoundResponse(res, 'No books found');
    }
    response.sendSuccessResponse(res, 'Get all books successfully', books);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { lang } = req.query;
    if (!lang || typeof lang !== 'string') {
      return response.sendErrorResponse(res, 'Invalid language parameter');
    }
    const book = await BookService.getById(id, lang);
    if (!book) {
      return response.sendNotFoundResponse(res, 'Book not found');
    }
    response.sendSuccessResponse(res, 'Get book by ID successfully', book);
  }),

  search: asyncHandler(async (req: Request, res: Response) => {
    const { lang, ...searchParams } = req.query;
    if (!lang || typeof lang !== 'string') {
      return response.sendErrorResponse(res, 'Invalid language parameter');
    }
    const books = await BookService.search(searchParams, lang);
    if (!books) {
      return response.sendNotFoundResponse(res, 'No books found');
    }
    response.sendSuccessResponse(res, 'Search books successfully', books);
  }),

  create: asyncHandler(async (req: AuthRequest, res: Response) => {
    const bookDto = req.body;
    const userId = req.user?._id;
    if (userId) {
      bookDto.updatedBy = userId.toString();
    }
    const createdBook = await BookService.create(bookDto);
    response.sendSuccessResponse(res, 'Create book successfully', createdBook);
  }),

  updateBook: asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const bookDto = req.body;
    const { lang } = req.query;
    if (!lang || typeof lang !== 'string') {
      return response.sendErrorResponse(res, 'Invalid language parameter');
    }
    const userId = req.user?._id;
    if (userId) {
      bookDto.updatedBy = userId.toString();
    }
    const updatedBook = await BookService.updateBook(id, lang, bookDto);
    response.sendSuccessResponse(res, 'Update book successfully', updatedBook);
  }),

  updateTranslation: asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const bookDto = req.body;
    const { lang } = req.query;
    if (!lang || typeof lang !== 'string') {
      return response.sendErrorResponse(res, 'Invalid language parameter');
    }
    const userId = req.user?._id;
    if (userId) {
      bookDto.updatedBy = userId.toString();
    }
    const updatedTrans = await BookService.updateTranslation(id, lang, bookDto);
    response.sendSuccessResponse(res, 'Update book translation successfully', updatedTrans);
  }),

  delete: asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    await BookService.delete(id);
    response.sendSuccessResponse(res, 'Delete book successfully', null);
  }),
};

export default BookController;