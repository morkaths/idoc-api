import DocumentService from '../services/document.service';
import { asyncHandler } from '../middleware/error.middleware';
import { AuthRequest } from '../types/request';
import * as response from '../utils/response.util';

const DocumentController = {
  getAll: asyncHandler(async (req, res) => {
    const lang = typeof req.query.lang === 'string' ? req.query.lang : undefined;
    const { data, pagination } = await DocumentService.search({ ...req.query, lang });
    if (!data || data.length === 0) {
      return response.notFound(res, 'No documents found');
    }
    response.paginated(res, 'Get all documents successfully', data, pagination);
  }),

  getByIds: asyncHandler(async (req, res) => {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return response.badRequest(res, 'List of IDs must not be empty');
    }
    const documents = await DocumentService.findByIds(ids);
    if (!documents || documents.length === 0) {
      return response.notFound(res, 'No documents found for the provided IDs');
    }
    response.success(res, 'Get documents successfully', documents);
  }),

  getById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const lang = typeof req.query.lang === 'string' ? req.query.lang : undefined;
    const document = await DocumentService.findById(id, lang);
    if (!document) {
      return response.notFound(res, 'Document not found');
    }
    response.success(res, 'Get document successfully', document);
  }),

  getByCategory: asyncHandler(async (req, res) => {
    const { categorySlug } = req.params;
    const lang = typeof req.query.lang === 'string' ? req.query.lang : undefined;
    const documents = await DocumentService.findByCategory(categorySlug, lang);
    if (!documents || documents.length === 0) {
      return response.notFound(res, 'No documents found for this category');
    }
    response.success(res, 'Get documents by category successfully', documents);
  }),

  search: asyncHandler(async (req, res) => {
    const lang = typeof req.query.lang === 'string' ? req.query.lang : undefined;
    const { data, pagination } = await DocumentService.search({ ...req.query, lang });
    if (!data || data.length === 0) {
      return response.notFound(res, 'No documents found for this search query');
    }
    response.paginated(res, 'Search documents successfully', data, pagination);
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