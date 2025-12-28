import AuthorService from '../services/author.service';
import { asyncHandler } from '../middleware/error-handler.middleware';
import { AuthRequest } from '../types/request';
import * as response from '../utils/response.util';

const AuthorController = {
  getList: asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, ...filters } = req.query;
    const { data, pagination } = await AuthorService.findList(
      Number(page),
      Number(limit),
      filters
    );
    if (!data || data.length === 0) {
      return response.notFound(res, 'No authors found');
    }
    response.paginated(res, 'Get authors successfully', data, pagination);
  }),

  getById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const author = await AuthorService.findById(id);
    if (!author) {
      return response.notFound(res, 'Author not found');
    }
    response.success(res, 'Get author successfully', author);
  }),

  getByIds: asyncHandler(async (req, res) => {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return response.badRequest(res, 'List of IDs must not be empty');
    }
    const authors = await AuthorService.findByIds(ids);
    if (!authors || authors.length === 0) {
      return response.notFound(res, 'No authors found for the provided IDs');
    }
    response.success(res, 'Get authors successfully', authors);
  }),

  create: asyncHandler<AuthRequest>(async (req, res) => {
    const authorDto = req.body;
    authorDto.updatedBy = req.user.id;
    const author = await AuthorService.create(authorDto);
    if (!author) return response.badRequest(res, "Failed to create author")
    response.created(res, 'Author created successfully', author);
  }),

  update: asyncHandler<AuthRequest>(async (req, res) => {
    const { id } = req.params;
    const authorDto = req.body;
    authorDto.updatedBy = req.user.id;
    const author = await AuthorService.update(id, authorDto);
    if (!author) {
      return response.notFound(res, 'Author not found');
    }
    response.updated(res, 'Author updated successfully', author);
  }),

  delete: asyncHandler<AuthRequest>(async (req, res) => {
    const { id } = req.params;
    const result = await AuthorService.delete(id);
    if (!result) {
      return response.notFound(res, 'Author not found');
    }
    response.deleted(res, 'Author deleted successfully');
  }),
};

export default AuthorController;