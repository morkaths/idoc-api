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
 * @route   GET /api/files/:fileId
 * @desc    Get file metadata
 * @access  Public
 */
router.get('/:fileId', FileController.getById);

/**
 * @route   GET /api/files/:fileId/download
 * @desc    Download file
 * @access  Public
 */
router.get('/:fileId/download', FileController.download);

/**
 * @route   POST /api/files/upload/direct
 * @desc    Upload file directly
 * @access  Private
 */
router.post('/upload/direct', authenticate, singleFileUpload, FileController.uploadDirect);

/**
 * @route   POST /api/files/upload/confirm
 * @desc    Confirm file upload
 * @access  Private
 */
router.post('/upload/confirm', authenticate, FileController.confirm);

/**
 * @route   POST /api/files/upload
 * @desc    Get presigned upload URL
 * @access  Private
 */
router.post('/upload', authenticate, FileController.upload);

/**
 * @route   DELETE /api/files/:fileId
 * @desc    Delete file
 * @access  Private
 */
router.delete('/:fileId', authenticate, FileController.delete);

export default router;