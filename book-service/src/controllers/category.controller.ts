import { Request, Response } from 'express';
import CategoryService from '../services/category.service';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../types/request';
import * as response from '../utils/response.util';

const CategoryController = {
    getAll: asyncHandler(async (req: Request, res: Response) => {
        const categories = await CategoryService.getAll();
        response.sendSuccessResponse(res, 'Get all categories successfully', categories);
    }),

    getById: asyncHandler(async (req: Request, res: Response) => {
        const category = await CategoryService.getById(req.params.id);
        if (!category) {
            return response.sendNotFoundResponse(res, 'Category not found');
        }
        response.sendSuccessResponse(res, 'Get category successfully', category);
    }),

    search: asyncHandler(async (req: Request, res: Response) => {
        const { query } = req.query;
        if (!query || typeof query !== 'string') {
            return response.sendErrorResponse(res, 'Invalid search query');
        }
        const categories = await CategoryService.search(
            { name: { $regex: query, $options: 'i' } }
        );
        response.sendSuccessResponse(res, 'Search categories successfully', categories);
    }),

    create: asyncHandler(async (req: AuthRequest, res: Response) => {
        const category = await CategoryService.create(req.body);
        response.sendCreatedResponse(res, 'Category created successfully', category);
    }),

    update: asyncHandler(async (req: AuthRequest, res: Response) => {
        const category = await CategoryService.update(req.params.id, req.body);
        if (!category) {
            return response.sendNotFoundResponse(res, 'Category not found');
        }
        response.sendSuccessResponse(res, 'Category updated successfully', category);
    }),

    delete: asyncHandler(async (req: AuthRequest, res: Response) => {
        const category = await CategoryService.delete(req.params.id);
        if (!category) {
            return response.sendNotFoundResponse(res, 'Category not found');
        }
        response.sendDeletedResponse(res, 'Category deleted successfully');
    }),
};

export default CategoryController;