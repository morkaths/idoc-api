import AuthorService from '../services/author.service';
import { asyncHandler } from '../middleware/error-handler';
import { AuthRequest } from '../types/request';
import * as response from '../utils/response.util';

const AuthorController = {
  getList: asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, ...filters } = req.query;
    const { data, pagination } = await AuthorService.getList(
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
    const author = await AuthorService.getById(id);
    if (!author) {
      return response.notFound(res, 'Author not found');
    }
    response.success(res, 'Get author successfully', author);
  }),

  create: asyncHandler<AuthRequest>(async (req, res) => {
    const authorDto = req.body;
    if (req.user && req.user.id) {
      authorDto.updatedBy = req.user.id;
    }
    const author = await AuthorService.create(authorDto);
    if (!author) return response.badRequest(res, "Failed to create author")
    response.created(res, 'Author created successfully', author);
  }),

  update: asyncHandler<AuthRequest>(async (req, res) => {
    const { id } = req.params;
    const authorDto = req.body;
    if (req.user && req.user.id) {
      authorDto.updatedBy = req.user.id;
    }
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