import BookService from '../services/book.service';
import { asyncHandler } from '../middleware/error.middleware';
import { AuthRequest, UploadRequest } from '../types';
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
    const books = await BookService.findByCategory(slug, lang);
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

  createMany: asyncHandler<AuthRequest>(async (req, res) => {
    const data = req.body;
    if (!Array.isArray(data)) {
      return response.badRequest(res, 'Body must be an array');
    }
    const dtos = data.map(d => ({ ...d, updatedBy: req.user.id }));
    const books = await BookService.createMany(dtos);
    response.created(res, 'Books created successfully', books);
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

  updateMany: asyncHandler<AuthRequest>(async (req, res) => {
    const { ...filters } = req.query;
    const dto = req.body;
    dto.updatedBy = req.user.id;
    const count = await BookService.updateMany(filters, dto);
    response.success(res, `Updated ${count} books successfully`, { count });
  }),

  delete: asyncHandler<AuthRequest>(async (req, res) => {
    const { id } = req.params;
    const result = await BookService.delete(id);
    if (!result) {
      return response.notFound(res, 'Book not found');
    }
    response.deleted(res, 'Book deleted successfully');
  }),

  importExcel: asyncHandler<UploadRequest>(async (req, res) => {
    if (!req.file) {
      return response.badRequest(res, 'No file uploaded');
    }
    const result = await BookService.importExcel(req.file.buffer);
    response.success(res, 'Import finished', result);
  }),

  exportExcel: asyncHandler(async (req, res) => {
    const { ...filters } = req.query;
    const buffer = await BookService.exportExcel(filters);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=books.xlsx');
    res.send(buffer);
  }),

};

export default BookController;