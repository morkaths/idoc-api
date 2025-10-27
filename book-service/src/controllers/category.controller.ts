import { Request, Response } from 'express';
import CategoryService from '../services/category.service';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../types/request';
import * as response from '../utils/response.util';

const CategoryController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const { lang } = req.query;
    if (!lang || typeof lang !== 'string') {
      return response.sendErrorResponse(res, 'Invalid language parameter');
    }
    const categories = await CategoryService.findAll(lang);
    if (!categories) {
      return response.sendNotFoundResponse(res, 'No categories found');
    }
    response.sendSuccessResponse(res, 'Get all categories successfully', categories);
  })
};

export default CategoryController;