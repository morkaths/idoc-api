import { Request, Response } from 'express';
import FileService from '../services/file.service';
import { asyncHandler } from '../middleware/error-handler';
import * as response from '../utils/response.util';

const FileController = {
  getById: asyncHandler(async (req: Request, res: Response) => {
    const { fileId } = req.params;
    const metadata = await FileService.getById(fileId);
    if (!metadata) {
      return response.notFound(res, 'File not found');
    }
    response.success(res, 'File metadata retrieved', metadata);
  }),

  // Lấy danh sách file theo user
  getByUser: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.query.userId as string;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    if (!userId) return response.badRequest(res, 'Missing userId');
    const files = await FileService.findByUser(userId, page, limit);
    response.success(res, 'Files by user', files);
  }),

  // Lấy danh sách file theo loại
  getByMimeType: asyncHandler(async (req: Request, res: Response) => {
    const mimeType = req.query.mimeType as string;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    if (!mimeType) return response.badRequest(res, 'Missing mimeType');
    const files = await FileService.findByMimeType(mimeType, page, limit);
    response.success(res, 'Files by mimeType', files);
  }),

  // Tìm kiếm file theo tên
  getByFilename: asyncHandler(async (req: Request, res: Response) => {
    const keyword = req.query.keyword as string;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    if (!keyword) return response.badRequest(res, 'Missing keyword');
    const files = await FileService.findByFilename(keyword, page, limit);
    response.success(res, 'Files by filename', files);
  }),

  download: asyncHandler(async (req: Request, res: Response) => {
    const { fileId } = req.params;
    const { buffer, metadata } = await FileService.download(fileId);

    res.setHeader('Content-Type', metadata.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${metadata.originalName}"`);
    res.setHeader('Content-Length', buffer.length);
    return res.send(buffer);
  }),

  upload: asyncHandler(async (req: Request, res: Response) => {
    const file = req.file;
    const userId = req.body.userId;

    if (!file || !userId) {
      return response.badRequest(res, 'Missing file or userId');
    }

    const result = await FileService.upload(file, userId);
    response.created(res, 'File uploaded successfully', result);
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const { fileId } = req.params;
    await FileService.delete(fileId);
    response.success(res, 'File deleted successfully');
  }),
};

export default FileController;