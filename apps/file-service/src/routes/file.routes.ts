import { Router } from 'express';
import FileController from '../controllers/file.controller';
import { authenticate } from '../middleware/auth.middleware';
import { singleFileUpload } from '../middleware/upload-file.middleware';

const router = Router();

/**
 * @route   GET /api/files/user?userId=...&limit=...&skip=...
 * @desc    Get files by user
 * @access  Private
 */
router.get('/user', authenticate, FileController.getByUser);

/**
 * @route   GET /api/files/type?mimeType=...&limit=...&skip=...
 * @desc    Get files by mimeType
 * @access  Private
 */
router.get('/type', authenticate, FileController.getByMimeType);

/**
 * @route   GET /api/files/search?filename=...&limit=...&skip=...
 * @desc    Search files by filename
 * @access  Private
 */
router.get('/search', authenticate, FileController.getByFilename);

/**
 * @route   GET /api/files/:key
 * @desc    Get file metadata by key
 * @access  Public
 */
router.get('/:key', FileController.getByKey);

/**
 * @route   GET /api/files/:key/download
 * @desc    Download file by key
 * @access  Public
 */
router.get('/:key/download', FileController.download);

/**
 * @route   POST /api/files/upload
 * @desc    Get presigned upload URL
 * @access  Private
 */
router.post('/upload/url', authenticate, FileController.getUploadUrl);

/**
 * @route   POST /api/files/upload/confirm
 * @desc    Confirm file upload
 * @access  Private
 */
router.post('/upload/confirm', authenticate, FileController.confirm);

/**
 * @route   POST /api/files/upload
 * @desc    Upload file directly
 * @access  Private
 */
router.post('/upload', authenticate, singleFileUpload, FileController.upload);

/**
 * @route   DELETE /api/files/:fileId
 * @desc    Delete file
 * @access  Private
 */
router.delete('/:key', authenticate, FileController.delete);

export default router;