import DocumentService from '../services/document.service';
import { asyncHandler } from '../middleware/error-handler.middleware';
import { AuthRequest } from '../types/request';
import * as response from '../utils/response.util';

const DocumentController = {
  getAll: asyncHandler(async (req, res) => {
    const lang = typeof req.query.lang === 'string' ? req.query.lang : undefined;
    const { data, pagination } = await DocumentService.search({ ...req.query, lang });
    if (!data || data.length === 0) {
      return response.notFound(res, 'No files found');
    }
    response.paginated(res, 'Get all files successfully', data, pagination);
  }),

  getById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const lang = typeof req.query.lang === 'string' ? req.query.lang : undefined;
    const file = await DocumentService.getById(id, lang);
    if (!file) {
      return response.notFound(res, 'File not found');
    }
    response.success(res, 'Get file successfully', file);
  }),

  getByCategory: asyncHandler(async (req, res) => {
    const { categorySlug } = req.params;
    const lang = typeof req.query.lang === 'string' ? req.query.lang : undefined;
    const files = await DocumentService.findByCategory(categorySlug, lang);
    if (!files || files.length === 0) {
      return response.notFound(res, 'No files found for this category');
    }
    response.success(res, 'Get files by category successfully', files);
  }),

  search: asyncHandler(async (req, res) => {
    const lang = typeof req.query.lang === 'string' ? req.query.lang : undefined;
    const { data, pagination } = await DocumentService.search({ ...req.query, lang });
    if (!data || data.length === 0) {
      return response.notFound(res, 'No files found for this search query');
    }
    response.paginated(res, 'Search files successfully', data, pagination);
  }),

  create: asyncHandler<AuthRequest>(async (req, res) => {
    const fileDto = req.body;
    const lang = typeof req.query.lang === 'string' ? req.query.lang : undefined;
    if (req.user?.id) {
      fileDto.updatedBy = req.user.id;
    }
    const file = await DocumentService.create(fileDto, lang);
    response.created(res, 'File created successfully', file);
  }),

  update: asyncHandler<AuthRequest>(async (req, res) => {
    const { id } = req.params;
    const fileDto = req.body;
    const lang = typeof req.query.lang === 'string' ? req.query.lang : undefined;
    if (req.user?.id) {
      fileDto.updatedBy = req.user.id;
    }
    const file = await DocumentService.update(id, fileDto, lang);
    if (!file) {
      return response.notFound(res, 'File not found');
    }
    response.updated(res, 'File updated successfully', file);
  }),

  delete: asyncHandler<AuthRequest>(async (req, res) => {
    const { id } = req.params;
    const result = await DocumentService.delete(id);
    if (!result) {
      return response.notFound(res, 'File not found');
    }
    response.deleted(res, 'File deleted successfully');
  }),
};

export default DocumentController;