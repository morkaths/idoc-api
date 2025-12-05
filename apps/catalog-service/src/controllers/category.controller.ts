import CategoryService from '../services/category.service';
import { asyncHandler } from '../middleware/error-handler.middleware';
import { AuthRequest } from '../types/request';
import * as response from '../utils/response.util';

const CategoryController = {
  getList: asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, ...filters } = req.query;
    const { data, pagination } = await CategoryService.getList(
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
    const category = await CategoryService.getById(id, lang);
    if (!category) {
      return response.notFound(res, 'Category not found');
    }
    response.success(res, 'Get category successfully', category);
  }),

  create: asyncHandler<AuthRequest>(async (req, res) => {
    const categoryDto = req.body;
    categoryDto.updatedBy = req.user.id;
    const category = await CategoryService.create(categoryDto);
    response.created(res, 'Category created successfully', category);
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

  delete: asyncHandler<AuthRequest>(async (req, res) => {
    const { id } = req.params;
    const result = await CategoryService.delete(id);
    if (!result) {
      return response.notFound(res, 'Category not found');
    }
    response.deleted(res, 'Category deleted successfully');
  }),

};

export default CategoryController;