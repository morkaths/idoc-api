import BookService from '../services/book.service';
import { asyncHandler } from '../middleware/error-handler.middleware';
import { AuthRequest } from '../types/request';
import * as response from '../utils/response.util';
import { isValidObjectId } from 'mongoose';

const BookController = {
  getList: asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, ...filters } = req.query;
    const { data, pagination } = await BookService.findList(
      Number(page),
      Number(limit),
      filters
    );
    if (!data || data.length === 0) {
      return response.notFound(res, 'No books found');
    }
    response.paginated(res, 'Get books successfully', data, pagination);
  }),

  getByCategory: asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const lang = typeof req.query.lang === 'string' ? req.query.lang : undefined;
    const books = await BookService.getByCategory(slug, lang);
    if (!books || books.length === 0) {
      return response.notFound(res, 'No books found for this category');
    }
    response.success(res, 'Get books by category successfully', books);
  }),

  getById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const lang = typeof req.query.lang === 'string' ? req.query.lang : undefined;
    const book = await BookService.findById(id, lang);
    if (!book) {
      return response.notFound(res, 'Book not found');
    }
    response.success(res, 'Get book successfully', book);
  }),

  getByIds: asyncHandler(async (req, res) => {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return response.badRequest(res, 'IDs must be a non-empty array');
    }
    const validIds = ids.filter((id: string) => isValidObjectId(id));
    if (validIds.length === 0) {
      return response.badRequest(res, 'All IDs are invalid');
    }
    const books = await BookService.findByIds(validIds);
    if (!books || books.length === 0) {
      return response.notFound(res, 'No books found for the provided IDs');
    }
    response.success(res, 'Get books successfully', books);
  }),

  create: asyncHandler<AuthRequest>(async (req, res) => {
    const bookDto = req.body;
    bookDto.updatedBy = req.user.id;
    const book = await BookService.create(bookDto);
    response.created(res, 'Book created successfully', book);
  }),

  update: asyncHandler<AuthRequest>(async (req, res) => {
    const { id } = req.params;
    const bookDto = req.body;
    bookDto.updatedBy = req.user.id;
    const book = await BookService.update(id, bookDto);
    if (!book) {
      return response.notFound(res, 'Book not found');
    }
    response.updated(res, 'Book updated successfully', book);
  }),

  delete: asyncHandler<AuthRequest>(async (req, res) => {
    const { id } = req.params;
    const result = await BookService.delete(id);
    if (!result) {
      return response.notFound(res, 'Book not found');
    }
    response.deleted(res, 'Book deleted successfully');
  }),

};

export default BookController;