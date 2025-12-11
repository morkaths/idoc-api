import { Request, Response } from 'express';
import ProfileService from '../services/profile.service';
import { asyncHandler } from '../middleware/error-handler.middleware';
import { AuthRequest } from '../types/request';
import * as response from '../utils/response.util';

const ProfileController = {
  getList: asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 10, ...filters } = req.query;
    const { data, pagination } = await ProfileService.getList(
      Number(page),
      Number(limit),
      filters
    );
    if (!data || data.length === 0) {
      return response.notFound(res, 'No profiles found');
    }
    response.paginated(res, 'Profiles retrieved successfully', data, pagination);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const profile = await ProfileService.findById(id);
    if (!profile) return response.notFound(res, "Profile not found");
    response.success(res, "Profile retrieved successfully", profile);
  }),

  getMe: asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) return response.unauthorized(res, "Unauthorized");
    const profile = await ProfileService.findOne({ userId });
    if (!profile) return response.notFound(res, "Profile not found");
    response.success(res, "Profile retrieved successfully", profile);
  }),

  create: asyncHandler(async (req: AuthRequest, res: Response) => {
    const data = req.body;
    const userId = req.user?.id;
    if (!userId) return response.unauthorized(res, "Unauthorized");
    data.userId = userId;
    const profile = await ProfileService.create(data);
    if (!profile) return response.badRequest(res, "Failed to create profile");
    response.created(res, "Profile created successfully", profile);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body;
    const updated = await ProfileService.update(id, data);
    if (!updated) return response.notFound(res, "Profile not found");
    response.updated(res, "Profile updated successfully", updated);
  }),

  updateMe: asyncHandler(async (req: AuthRequest, res: Response) => {
    const data = req.body;
    const userId = req.user?.id;
    if (!userId) return response.unauthorized(res, "Unauthorized");
    const updated = await ProfileService.findOneAndUpdate({ userId }, data);
    if (!updated) return response.notFound(res, "Profile not found");
    response.updated(res, "Profile updated successfully", updated);
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const deleted = await ProfileService.delete(id);
    if (!deleted) return response.notFound(res, "Profile not found");
    response.deleted(res, "Profile deleted successfully");
  }),
};

export default ProfileController;