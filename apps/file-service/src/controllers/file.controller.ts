import FileService from '../services/file.service';
import { asyncHandler } from '../middleware/error-handler.middleware';
import * as response from '../utils/response.util';
import { AuthRequest, UploadRequest } from 'src/types';
import { MinioService } from '../services/minio.service';

const FileController = {
  // Lấy metadata file theo key
  getByKey: asyncHandler(async (req, res) => {
    const { key } = req.params;
    const metadata = await FileService.getByKey(key);
    if (!metadata) {
      return response.notFound(res, 'File not found');
    }
    response.success(res, 'File metadata retrieved', metadata);
  }),

  // Lấy danh sách file theo user
  getByUser: asyncHandler(async (req, res) => {
    const userId = req.query.userId as string;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    if (!userId) return response.badRequest(res, 'Missing userId');
    const files = await FileService.getByUser(userId, page, limit);
    response.success(res, 'Files by user', files);
  }),

  // Lấy danh sách file theo loại
  getByMimeType: asyncHandler(async (req, res) => {
    const mimeType = req.query.mimeType as string;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    if (!mimeType) return response.badRequest(res, 'Missing mimeType');
    const files = await FileService.getByMimeType(mimeType, page, limit);
    response.success(res, 'Files by mimeType', files);
  }),

  // Tìm kiếm file theo tên
  getByFilename: asyncHandler(async (req, res) => {
    const keyword = req.query.keyword as string;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    if (!keyword) return response.badRequest(res, 'Missing keyword');
    const files = await FileService.getByFilename(keyword, page, limit);
    response.success(res, 'Files by filename', files);
  }),

  getUploadUrl: asyncHandler<AuthRequest>(async (req, res) => {
    const userId = req.user.id;
    const { filename, type } = req.body;
    const result = await MinioService.getPresignedUploadUrl(userId, filename, type);
    response.success(res, 'Upload URL generated', result);
  }),

  upload: asyncHandler<UploadRequest>(async (req, res) => {
    const file = req.file;
    const userId = req.user.id;
    if (!file) {
      return response.badRequest(res, 'No file uploaded');
    }
    const result = await FileService.upload(userId, file);
    response.created(res, 'File uploaded successfully', result);
  }),

  confirm: asyncHandler<AuthRequest>(async (req, res) => {
    const userId = req.user.id;
    const { key } = req.body;
    if (!key) {
      return response.badRequest(res, 'Missing file key');
    }
    const metadata = await MinioService.confirmUpload(userId, key);
    const result = await FileService.create(metadata);
    response.created(res, 'Upload confirmed successfully', result);
  }),

  download: asyncHandler(async (req, res) => {
    const { key } = req.params;
    try {
      const { buffer, metadata } = await FileService.download(key);
      res.setHeader('Content-Type', metadata.mimeType);
      res.setHeader('Content-Disposition', `attachment; filename="${metadata.filename}"`);
      res.setHeader('Content-Length', buffer.length);
      return res.send(buffer);
    } catch {
      return response.notFound(res, 'File not found');
    }
  }),

  delete: asyncHandler<AuthRequest>(async (req, res) => {
    const { key } = req.params;
    await FileService.delete(key);
    response.success(res, 'File deleted successfully');
  }),
};

export default FileController;