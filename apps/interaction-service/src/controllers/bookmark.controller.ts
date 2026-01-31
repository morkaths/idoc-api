import { bookmarkService } from '../services/bookmark.service';
import { asyncHandler } from '../middleware/error.middleware';
import { AuthRequest } from '../types';
import * as response from '../utils/response.util';

const BookmarkController = {
    getList: asyncHandler(async (req, res) => {
        const { page = 1, limit = 10, ...filters } = req.query;
        const { data, pagination } = await bookmarkService.findList(
            Number(page),
            Number(limit),
            filters
        );
        if (!data || data.length === 0) {
            return response.success(res, 'No bookmarks found', []);
        }
        response.paginated(res, 'Get bookmarks successfully', data, pagination);
    }),

    getById: asyncHandler(async (req, res) => {
        const { id } = req.params;
        const result = await bookmarkService.findById(id);
        if (!result) {
            return response.notFound(res, 'Bookmark not found');
        }
        response.success(res, 'Get bookmark successfully', result);
    }),

    getByIds: asyncHandler(async (req, res) => {
        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.length === 0) {
            return response.badRequest(res, 'List of IDs must not be empty');
        }
        const results = await bookmarkService.findByIds(ids);
        if (!results || results.length === 0) {
            return response.notFound(res, 'No bookmarks found for the provided IDs');
        }
        response.success(res, 'Get bookmarks successfully', results);
    }),

    status: asyncHandler<AuthRequest>(async (req, res) => {
        const { itemIds } = req.body;
        if (!Array.isArray(itemIds)) {
            return response.badRequest(res, 'itemIds must be an array');
        }
        const result = await bookmarkService.getByItemIds(req.user.id, itemIds);
        response.success(res, 'Get bookmark statuses successfully', result);
    }),

    create: asyncHandler<AuthRequest>(async (req, res) => {
        const dto = req.body;
        dto.userId = req.user.id;
        const result = await bookmarkService.create(dto);
        if (!result) return response.badRequest(res, "Failed to create bookmark");
        response.created(res, 'Bookmark created successfully', result);
    }),

    createMany: asyncHandler<AuthRequest>(async (req, res) => {
        const data = req.body;
        if (!Array.isArray(data)) {
            return response.badRequest(res, 'Body must be an array');
        }
        const dtos = data.map(d => ({ ...d, userId: req.user.id }));
        const results = await bookmarkService.createMany(dtos);
        response.created(res, 'Bookmarks created successfully', results);
    }),

    update: asyncHandler<AuthRequest>(async (req, res) => {
        const { id } = req.params;
        const dto = req.body;
        // Check ownership if needed or assume service handles it/admin access
        const result = await bookmarkService.update(id, dto);
        if (!result) {
            return response.notFound(res, 'Bookmark not found');
        }
        response.updated(res, 'Bookmark updated successfully', result);
    }),

    updateMany: asyncHandler<AuthRequest>(async (req, res) => {
        const { ...filters } = req.query;
        const dto = req.body;
        // dto.updatedBy = req.user.id; // Bookmark might not track updatedBy usually, but if DTO has it.
        const count = await bookmarkService.updateMany(filters, dto);
        response.success(res, `Updated ${count} bookmarks successfully`, { count });
    }),

    delete: asyncHandler<AuthRequest>(async (req, res) => {
        const { id } = req.params;
        const result = await bookmarkService.delete(id);
        if (!result) {
            return response.notFound(res, 'Bookmark not found');
        }
        response.deleted(res, 'Bookmark deleted successfully');
    }),
};

export default BookmarkController;
