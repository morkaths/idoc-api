import { Request, Response } from 'express';
import CategoryService from '../services/category.service';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../types/request';
import * as response from '../utils/response.util';

const CategoryController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const { lang } = req.query;
    if (!lang || typeof lang !== 'string') {
      return response.error(res, 'Invalid language parameter');
    }
    const categories = await CategoryService.findAllWithTrans(lang);
    if (!categories) {
      return response.notFound(res, 'No categories found');
    }
    response.success(res, 'Get all categories successfully', categories);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { lang } = req.query;
    if (!lang || typeof lang !== 'string') {
      return response.error(res, 'Invalid language parameter');
    }
    const category = await CategoryService.findByIdWithTrans(id, lang);
    if (!category) {
      return response.notFound(res, 'Category not found');
    }
    response.success(res, 'Get category successfully', category);
  }),
  search: asyncHandler(async (req: Request, res: Response) => {
    const { query } = req.query;
    const { lang } = req.query;
    if (!query || typeof query !== 'string') {
      return response.error(res, 'Invalid search query parameter');
    }
    if (!lang || typeof lang !== 'string') {
      return response.error(res, 'Invalid language parameter');
    }
    const categories = await CategoryService.searchWithTrans(query, lang);
    if (!categories || categories.length === 0) {
      return response.notFound(res, 'No categories found for this search query');
    }
    response.success(res, 'Search categories successfully', categories);
  }),

  create: asyncHandler(async (req: AuthRequest, res: Response) => {
    const categoryDto = req.body;
    if (req.user && req.user.id) {
      categoryDto.updatedBy = req.user.id;
    }
    const category = await CategoryService.create(categoryDto);
    response.success(res, 'Category created successfully', category);
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
    response.success(res, 'Category updated successfully', category);
  }),

  delete: asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const result = await CategoryService.delete(id);
    if (!result) {
      return response.notFound(res, 'Category not found');
    }
    response.success(res, 'Category deleted successfully', null);
  }),

};

export default CategoryController;