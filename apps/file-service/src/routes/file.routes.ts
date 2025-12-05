import { Router } from 'express';
import FileController from '../controllers/file.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { multipleFilesUpload, singleFileUpload } from '../middleware/upload-file.middleware';

const router = Router();

/**
 * @route   GET /api/files/user?userId=...&limit=...&skip=...
 * @desc    Get files by user
 * @access  Private
 */
router.get('/user', authenticateToken, FileController.getByUser);

/**
 * @route   GET /api/files/type?mimeType=...&limit=...&skip=...
 * @desc    Get files by mimeType
 * @access  Private
 */
router.get('/type', authenticateToken, FileController.getByMimeType);

/**
 * @route   GET /api/files/search?filename=...&limit=...&skip=...
 * @desc    Search files by filename
 * @access  Private
 */
router.get('/search', authenticateToken, FileController.getByFilename);

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
 * @route   POST /api/files/upload
 * @desc    Upload a file
 * @access  Private
 */
router.post('/upload', authenticateToken, singleFileUpload, FileController.upload);

/**
 * @route   POST /api/files/upload-multiple
 * @desc    Upload multiple files
 * @access  Private
 */
router.post('/upload-multiple', authenticateToken, multipleFilesUpload, FileController.uploadMultiple);

/**
 * @route   DELETE /api/files/:fileId
 * @desc    Delete file
 * @access  Private
 */
router.delete('/:fileId', authenticateToken, FileController.delete);

export default router;