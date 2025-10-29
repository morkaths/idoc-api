import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import * as response from '../utils/response.util';
import { BaseService } from './base.service';
import { Document } from 'mongoose';

export function createBaseController<E extends Document, D>(service: BaseService<E, D>) {
  return {
    getAll: asyncHandler(async (req: Request, res: Response) => {
      const items = await service.findAll();
      if (!items || items.length === 0) {
        return response.notFound(res, 'No items found');
      }
      response.success(res, 'Get all items successfully', items);
    }),

    getById: asyncHandler(async (req: Request, res: Response) => {
      const { id } = req.params;
      if (!id) {
        return response.error(res, 'Invalid ID parameter');
      }
      const item = await service.findById(id);
      if (!item) {
        return response.notFound(res, 'Item not found');
      }
      response.success(res, 'Get item successfully', item);
    }),

    create: asyncHandler(async (req: Request, res: Response) => {
      const data = req.body;
      if (!data) {
        return response.error(res, 'Invalid create data');
      }
      const item = await service.create(data);
      response.created(res, 'Item created successfully', item);
    }),

    update: asyncHandler(async (req: Request, res: Response) => {
      const { id } = req.params;
      if (!id) {
        return response.error(res, 'Invalid ID parameter');
      }
      const data = req.body;
      if (!data) {
        return response.error(res, 'Invalid update data');
      }
      const item = await service.update(id, data);
      if (!item) {
        return response.notFound(res, 'Item not found');
      }
      response.updated(res, 'Item updated successfully', item);
    }),

    delete: asyncHandler(async (req: Request, res: Response) => {
      const { id } = req.params;
      if (!id) {
        return response.error(res, 'Invalid ID parameter');
      }
      const result = await service.delete(id);
      if (!result) {
        return response.notFound(res, 'Item not found');
      }
      response.deleted(res, 'Item deleted successfully');
    }),
  };
}