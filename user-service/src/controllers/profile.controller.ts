import { Request, Response } from 'express';
import ProfileService from '../services/profile.service';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../types/request';

const ProfileController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const profiles = await ProfileService.getAll();
    res.status(200).json({ success: true, data: profiles });
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const profile = await ProfileService.getById(id);
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }
    res.status(200).json({ success: true, data: profile });
  }),

  getMe: asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as AuthRequest).user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const profile = await ProfileService.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }
    res.status(200).json({ success: true, data: profile });
  }),

  search: asyncHandler(async (req: Request, res: Response) => {
    const { query } = req.query;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ success: false, message: 'Query parameter is required' });
    }
    const profiles = await ProfileService.find({
      $or: [
        { fullName: { $regex: query, $options: 'i' } },
        { bio: { $regex: query, $options: 'i' } },
        { location: { $regex: query, $options: 'i' } },
      ]
    });
    res.status(200).json({ success: true, data: profiles });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const data = req.body;
    const profile = await ProfileService.create(data);
    if (!profile) {
      return res.status(400).json({ success: false, message: 'Failed to create profile' });
    }
    res.status(201).json({ success: true, data: profile });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body;

    const updated = await ProfileService.update(id, data);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }
    res.status(200).json({ success: true, data: updated });
  }),

  updateMe: asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as AuthRequest).user?._id;
    const data = req.body;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const updated = await ProfileService.updateByUserId(userId, data);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }
    res.status(200).json({ success: true, data: updated });
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const deleted = await ProfileService.delete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }
    res.status(200).json({ success: true, message: 'Profile deleted successfully' });
  }),

}

export default ProfileController;