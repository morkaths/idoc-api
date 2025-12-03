import { Request, Response } from 'express';
import CategoryService from '../services/category.service';
import { asyncHandler } from '../middleware/error-handler';
import { AuthRequest } from '../types/request';
import * as response from '../utils/response.util';

const CategoryController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const {data, pagination} = await CategoryService.search(req.query);
    if (!data || data.length === 0) {
      return response.notFound(res, 'No categories found');
    }
    response.paginated(res, 'Get all categories successfully', data, pagination);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const lang = typeof req.query.lang === 'string' ? req.query.lang : undefined;
    const category = await CategoryService.findById(id, lang);
    if (!category) {
      return response.notFound(res, 'Category not found');
    }
    response.success(res, 'Get category successfully', category);
  }),
  
  search: asyncHandler(async (req: Request, res: Response) => {
    const {data, pagination} = await CategoryService.search(req.query);
    if (!data || data.length === 0) {
      return response.notFound(res, 'No categories found for this search query');
    }
    response.paginated(res, 'Search categories successfully', data, pagination);
  }),

  create: asyncHandler(async (req: AuthRequest, res: Response) => {
    const categoryDto = req.body;
    if (req.user && req.user.id) {
      categoryDto.updatedBy = req.user.id;
    }
    const category = await CategoryService.create(categoryDto);
    response.created(res, 'Category created successfully', category);
  }),

  update: asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const categoryDto = req.body;
    if (req.user && req.user.id) {
      categoryDto.updatedBy = req.user.id;
    }
    const category = await CategoryService.update(id, categoryDto);
    if (!category) {
      return response.notFound(res, 'Category not found');
    }
    response.updated(res, 'Category updated successfully', category);
  }),

  delete: asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const result = await CategoryService.delete(id);
    if (!result) {
      return response.notFound(res, 'Category not found');
    }
    response.deleted(res, 'Category deleted successfully');
  }),

};

export default CategoryController;