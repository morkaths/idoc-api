import { CloudinaryService } from '../services/cloundinary.service';
import { extractPublicId } from '../utils/cloundinary.util';
import { asyncHandler } from 'src/middleware/error-handler.middleware';
import { UploadRequest } from 'src/types';
import * as response from '../utils/response.util';

export const ImageController = {
  upload: asyncHandler<UploadRequest>(async (req, res) => {
    const file = req.file;
    const { folder } = req.body;
    if (!file) {
      return response.badRequest(res, 'No file uploaded');
    }
    const result = await CloudinaryService.upload(file.buffer, folder);
    response.created(res, 'Image uploaded successfully', result);
  }),

  delete: asyncHandler(async (req, res) => {
    const { url } = req.body;
    if (!url) {
      return response.badRequest(res, 'Missing image URL');
    }
    const publicId = extractPublicId(url);
    if (!publicId) {
      return response.badRequest(res, 'Invalid Cloudinary URL');
    }
    await CloudinaryService.delete(publicId);
    response.success(res, 'Image deleted successfully');
  }),
};