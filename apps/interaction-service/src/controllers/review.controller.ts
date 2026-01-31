import { reviewService } from '../services/review.service';
import { asyncHandler } from '../middleware/error.middleware';
import { AuthRequest } from '../types';
import * as response from '../utils/response.util';

const ReviewController = {
    getList: asyncHandler(async (req, res) => {
        const { page = 1, limit = 10, ...filters } = req.query;
        const { data, pagination } = await reviewService.findList(
            Number(page),
            Number(limit),
            filters
        );
        if (!data || data.length === 0) {
            return response.success(res, 'No reviews found', []);
        }
        response.paginated(res, 'Get reviews successfully', data, pagination);
    }),

    getById: asyncHandler(async (req, res) => {
        const { id } = req.params;
        const result = await reviewService.findById(id);
        if (!result) {
            return response.notFound(res, 'Review not found');
        }
        response.success(res, 'Get review successfully', result);
    }),

    getByIds: asyncHandler(async (req, res) => {
        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.length === 0) {
            return response.badRequest(res, 'List of IDs must not be empty');
        }
        const results = await reviewService.findByIds(ids);
        if (!results || results.length === 0) {
            return response.notFound(res, 'No reviews found for the provided IDs');
        }
        response.success(res, 'Get reviews successfully', results);
    }),

    create: asyncHandler<AuthRequest>(async (req, res) => {
        const dto = req.body;
        dto.userId = req.user.id;
        const result = await reviewService.create(dto);
        if (!result) return response.badRequest(res, "Failed to create review");
        response.created(res, 'Review created successfully', result);
    }),

    createMany: asyncHandler<AuthRequest>(async (req, res) => {
        const data = req.body;
        if (!Array.isArray(data)) {
            return response.badRequest(res, 'Body must be an array');
        }
        const dtos = data.map(d => ({ ...d, userId: req.user.id }));
        const results = await reviewService.createMany(dtos);
        response.created(res, 'Reviews created successfully', results);
    }),

    update: asyncHandler<AuthRequest>(async (req, res) => {
        const { id } = req.params;
        const dto = req.body;
        const result = await reviewService.update(id, dto);
        if (!result) {
            return response.notFound(res, 'Review not found');
        }
        response.updated(res, 'Review updated successfully', result);
    }),

    updateMany: asyncHandler<AuthRequest>(async (req, res) => {
        const { ...filters } = req.query;
        const dto = req.body;
        const count = await reviewService.updateMany(filters, dto);
        response.success(res, `Updated ${count} reviews successfully`, { count });
    }),

    delete: asyncHandler<AuthRequest>(async (req, res) => {
        const { id } = req.params;
        const result = await reviewService.delete(id);
        if (!result) {
            return response.notFound(res, 'Review not found');
        }
        response.deleted(res, 'Review deleted successfully');
    }),
};

export default ReviewController;
