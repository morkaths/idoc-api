import { Request, Response } from 'express';
import AuthorService from '../services/author.service';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../types/request';
import * as response from '../utils/response.util';

const AuthorController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const authors = await AuthorService.findAll();
    if (!authors || authors.length === 0) {
      return response.notFound(res, 'No authors found');
    }
    response.success(res, 'Get all authors successfully', authors);
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
    const authors = await AuthorService.search(req.query);
    if (!authors || authors.length === 0) {
      return response.notFound(res, 'No authors found for this search query');
    }
    response.success(res, 'Search authors successfully', authors);
  }),

  create: asyncHandler(async (req: AuthRequest, res: Response) => {
    const authorDto = req.body;
    if (req.user && req.user.id) {
      authorDto.updatedBy = req.user.id;
    }
    const author = await AuthorService.create(authorDto);
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