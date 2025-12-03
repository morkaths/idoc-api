import { Request, Response } from 'express';
import AuthorService from '../services/author.service';
import { asyncHandler } from '../middleware/error-handler';
import { AuthRequest } from '../types/request';
import * as response from '../utils/response.util';

const AuthorController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const {data, pagination} = await AuthorService.search(req.query);
    if (!data || data.length === 0) {
      return response.notFound(res, 'No authors found');
    }
    response.paginated(res, 'Get all authors successfully', data, pagination);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const author = await AuthorService.findById(id);
    if (!author) {
      return response.notFound(res, 'Author not found');
    }
    response.success(res, 'Get author successfully', author);
  }),

  search: asyncHandler(async (req: Request, res: Response) => {
    const {data, pagination} = await AuthorService.search(req.query);
    if (!data || data.length === 0) {
      return response.notFound(res, 'No authors found for this search query');
    }
    response.paginated(res, 'Search authors successfully', data, pagination);
  }),

  create: asyncHandler(async (req: AuthRequest, res: Response) => {
    const authorDto = req.body;
    if (req.user && req.user.id) {
      authorDto.updatedBy = req.user.id;
    }
    const author = await AuthorService.create(authorDto);
    if(!author) return response.badRequest(res, "Failed to create author")
    response.created(res, 'Author created successfully', author);
  }),

  update: asyncHandler(async (req: AuthRequest, res: Response) => {
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

  delete: asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const result = await AuthorService.delete(id);
    if (!result) {
      return response.notFound(res, 'Author not found');
    }
    response.deleted(res, 'Author deleted successfully');
  }),
};

export default AuthorController;