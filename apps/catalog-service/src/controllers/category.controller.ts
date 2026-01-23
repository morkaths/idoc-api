import CategoryService from '../services/category.service';
import { asyncHandler } from '../middleware/error.middleware';
import { AuthRequest, UploadRequest } from '../types';
import * as response from '../utils/response.util';

const CategoryController = {
  getList: asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, ...filters } = req.query;
    const { data, pagination } = await CategoryService.findList(
      Number(page),
      Number(limit),
      filters
    );
    if (!data || data.length === 0) {
      return response.notFound(res, 'No categories found');
    }
    response.paginated(res, 'Get categories successfully', data, pagination);
  }),

  getById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const lang = typeof req.query.lang === 'string' ? req.query.lang : undefined;
    const category = await CategoryService.findById(id, lang);
    if (!category) {
      return response.notFound(res, 'Category not found');
    }
    response.success(res, 'Get category successfully', category);
  }),

  getByIds: asyncHandler(async (req, res) => {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return response.badRequest(res, 'List of IDs must not be empty');
    }
    const categories = await CategoryService.findByIds(ids);
    if (!categories || categories.length === 0) {
      return response.notFound(res, 'No categories found for the provided IDs');
    }
    response.success(res, 'Get categories successfully', categories);
  }),

  create: asyncHandler<AuthRequest>(async (req, res) => {
    const categoryDto = req.body;
    categoryDto.updatedBy = req.user.id;
    const category = await CategoryService.create(categoryDto);
    response.created(res, 'Category created successfully', category);
  }),

  createMany: asyncHandler<AuthRequest>(async (req, res) => {
    const data = req.body;
    if (!Array.isArray(data)) {
      return response.badRequest(res, 'Body must be an array');
    }
    const dtos = data.map(d => ({ ...d, updatedBy: req.user.id }));
    const categories = await CategoryService.createMany(dtos);
    response.created(res, 'Categories created successfully', categories);
  }),

  update: asyncHandler<AuthRequest>(async (req, res) => {
    const { id } = req.params;
    const categoryDto = req.body;
    categoryDto.updatedBy = req.user.id;
    const category = await CategoryService.update(id, categoryDto);
    if (!category) {
      return response.notFound(res, 'Category not found');
    }
    response.updated(res, 'Category updated successfully', category);
  }),

  updateMany: asyncHandler<AuthRequest>(async (req, res) => {
    const { ...filters } = req.query;
    const dto = req.body;
    dto.updatedBy = req.user.id;
    const count = await CategoryService.updateMany(filters, dto);
    response.success(res, `Updated ${count} categories successfully`, { count });
  }),

  delete: asyncHandler<AuthRequest>(async (req, res) => {
    const { id } = req.params;
    const result = await CategoryService.delete(id);
    if (!result) {
      return response.notFound(res, 'Category not found');
    }
    response.deleted(res, 'Category deleted successfully');
  }),

  importExcel: asyncHandler<UploadRequest>(async (req, res) => {
    if (!req.file) {
      return response.badRequest(res, 'No file uploaded');
    }
    const result = await CategoryService.importExcel(req.file.buffer);
    response.success(res, 'Import finished', result);
  }),

  exportExcel: asyncHandler(async (req, res) => {
    const { ...filters } = req.query;
    const buffer = await CategoryService.exportExcel(filters);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=categories.xlsx');
    res.send(buffer);
  }),

};

export default CategoryController;