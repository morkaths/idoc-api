import { Request, Response } from 'express';
import FileService from '../services/file.service';
import { asyncHandler } from '../middleware/error-handler';
import { AuthRequest } from '../types/request';
import * as response from '../utils/response.util';

const FileController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const lang = typeof req.query.lang === 'string' ? req.query.lang : undefined;
    const { data, pagination } = await FileService.search({ ...req.query, lang });
    if (!data || data.length === 0) {
      return response.notFound(res, 'No files found');
    }
    response.paginated(res, 'Get all files successfully', data, pagination);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const lang = typeof req.query.lang === 'string' ? req.query.lang : undefined;
    const file = await FileService.findById(id, lang);
    if (!file) {
      return response.notFound(res, 'File not found');
    }
    response.success(res, 'Get file successfully', file);
  }),

  getByCategory: asyncHandler(async (req: Request, res: Response) => {
    const { categorySlug } = req.params;
    const lang = typeof req.query.lang === 'string' ? req.query.lang : undefined;
    const files = await FileService.findByCategory(categorySlug, lang);
    if (!files || files.length === 0) {
      return response.notFound(res, 'No files found for this category');
    }
    response.success(res, 'Get files by category successfully', files);
  }),

  search: asyncHandler(async (req: Request, res: Response) => {
    const lang = typeof req.query.lang === 'string' ? req.query.lang : undefined;
    const { data, pagination } = await FileService.search({ ...req.query, lang });
    if (!data || data.length === 0) {
      return response.notFound(res, 'No files found for this search query');
    }
    response.paginated(res, 'Search files successfully', data, pagination);
  }),

  create: asyncHandler(async (req: AuthRequest, res: Response) => {
    const fileDto = req.body;
    const lang = typeof req.query.lang === 'string' ? req.query.lang : undefined;
    if (req.user?.id) {
      fileDto.updatedBy = req.user.id;
    }
    const file = await FileService.create(fileDto, lang);
    response.created(res, 'File created successfully', file);
  }),

  update: asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const fileDto = req.body;
    const lang = typeof req.query.lang === 'string' ? req.query.lang : undefined;
    if (req.user?.id) {
      fileDto.updatedBy = req.user.id;
    }
    const file = await FileService.update(id, fileDto, lang);
    if (!file) {
      return response.notFound(res, 'File not found');
    }
    response.updated(res, 'File updated successfully', file);
  }),

  delete: asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const result = await FileService.delete(id);
    if (!result) {
      return response.notFound(res, 'File not found');
    }
    response.deleted(res, 'File deleted successfully');
  }),
};

export default FileController;