import { collectionService } from '../services/collection.service';
import { asyncHandler } from '../middleware/error.middleware';
import { AuthRequest } from '../types';
import * as response from '../utils/response.util';

const CollectionController = {
    getList: asyncHandler(async (req, res) => {
        const { page = 1, limit = 10, ...filters } = req.query;
        const { data, pagination } = await collectionService.findList(
            Number(page),
            Number(limit),
            filters
        );
        if (!data || data.length === 0) {
            return response.success(res, 'No collections found', []);
        }
        response.paginated(res, 'Get collections successfully', data, pagination);
    }),

    getById: asyncHandler(async (req, res) => {
        const { id } = req.params;
        const result = await collectionService.findById(id);
        if (!result) {
            return response.notFound(res, 'Collection not found');
        }
        response.success(res, 'Get collection successfully', result);
    }),

    getByIds: asyncHandler(async (req, res) => {
        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.length === 0) {
            return response.badRequest(res, 'List of IDs must not be empty');
        }
        const results = await collectionService.findByIds(ids);
        if (!results || results.length === 0) {
            return response.notFound(res, 'No collections found for the provided IDs');
        }
        response.success(res, 'Get collections successfully', results);
    }),

    create: asyncHandler<AuthRequest>(async (req, res) => {
        const dto = req.body;
        dto.userId = req.user.id;
        const result = await collectionService.create(dto);
        if (!result) return response.badRequest(res, "Failed to create collection");
        response.created(res, 'Collection created successfully', result);
    }),

    createMany: asyncHandler<AuthRequest>(async (req, res) => {
        const data = req.body;
        if (!Array.isArray(data)) {
            return response.badRequest(res, 'Body must be an array');
        }
        const dtos = data.map(d => ({ ...d, userId: req.user.id }));
        const results = await collectionService.createMany(dtos);
        response.created(res, 'Collections created successfully', results);
    }),

    update: asyncHandler<AuthRequest>(async (req, res) => {
        const { id } = req.params;
        const dto = req.body;
        const result = await collectionService.update(id, dto);
        if (!result) {
            return response.notFound(res, 'Collection not found');
        }
        response.updated(res, 'Collection updated successfully', result);
    }),

    updateMany: asyncHandler<AuthRequest>(async (req, res) => {
        const { ...filters } = req.query;
        const dto = req.body;
        const count = await collectionService.updateMany(filters, dto);
        response.success(res, `Updated ${count} collections successfully`, { count });
    }),

    delete: asyncHandler<AuthRequest>(async (req, res) => {
        const { id } = req.params;
        const result = await collectionService.delete(id);
        if (!result) {
            return response.notFound(res, 'Collection not found');
        }
        response.deleted(res, 'Collection deleted successfully');
    }),
};

export default CollectionController;
