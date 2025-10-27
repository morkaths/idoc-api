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
    const books = await BookService.findAll(lang);
    if (!books) {
      return response.sendNotFoundResponse(res, 'No books found');
    }
    response.sendSuccessResponse(res, 'Get all books successfully', books);
  })
};

export default BookController;