import FileService from '../services/file.service';
import { asyncHandler } from '../middleware/error-handler.middleware';
import * as response from '../utils/response.util';
import { AuthRequest, UploadRequest } from 'src/types';
import FileStorageService from 'src/services/storage.service';

const FileController = {
  getById: asyncHandler(async (req, res) => {
    const { fileId } = req.params;
    const metadata = await FileService.getById(fileId);
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
    const files = await FileService.findByUser(userId, page, limit);
    response.success(res, 'Files by user', files);
  }),

  // Lấy danh sách file theo loại
  getByMimeType: asyncHandler(async (req, res) => {
    const mimeType = req.query.mimeType as string;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    if (!mimeType) return response.badRequest(res, 'Missing mimeType');
    const files = await FileService.findByMimeType(mimeType, page, limit);
    response.success(res, 'Files by mimeType', files);
  }),

  // Tìm kiếm file theo tên
  getByFilename: asyncHandler(async (req, res) => {
    const keyword = req.query.keyword as string;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    if (!keyword) return response.badRequest(res, 'Missing keyword');
    const files = await FileService.findByFilename(keyword, page, limit);
    response.success(res, 'Files by filename', files);
  }),

  uploadDirect: asyncHandler<UploadRequest>(async (req, res) => {
    const file = req.file;
    const userId = req.user.id;
    if (!file) {
      return response.badRequest(res, 'No file uploaded');
    }
    const { bucket, objectName } = await FileStorageService.uploadDirect(userId, file);
    const result = await FileService.create({
      filename: file.originalname,
      objectName,
      mimeType: file.mimetype,
      size: file.size,
      bucket,
      provider: 'minio',
      uploadedBy: userId
    });
    response.created(res, 'File uploaded successfully', result);
  }),

  upload: asyncHandler<AuthRequest>(async (req, res) => {
    const userId = req.user.id;
    const { filename, type } = req.body;
    const result = await FileStorageService.upload(userId, filename, type);
    response.success(res, 'Upload URL generated', result);
  }),

  confirm: asyncHandler<AuthRequest>(async (req, res) => {
    const userId = req.user.id;
    const { uploadId } = req.body;
    const metadata = await FileStorageService.confirm(userId, uploadId);
    const result = await FileService.create(metadata);
    response.created(res, 'Upload confirmed successfully', result);
  }),

  download: asyncHandler(async (req, res) => {
    const { fileId } = req.params;
    const metadata = await FileService.getRawById(fileId);
    if (!metadata || !metadata.objectName) {
      return response.notFound(res, 'File not found');
    }
    const buffer = await FileStorageService.download(metadata.objectName);
    res.setHeader('Content-Type', metadata.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${metadata.filename}"`);
    res.setHeader('Content-Length', buffer.length);
    return res.send(buffer);
  }),

  delete: asyncHandler<AuthRequest>(async (req, res) => {
    const { fileId } = req.params;
    await FileService.delete(fileId);
    response.success(res, 'File deleted successfully');
  }),
};

export default FileController;