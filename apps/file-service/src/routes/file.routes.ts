import { Router } from 'express';
import FileController from '../controllers/file.controller';
import { singleFileUpload } from '../middleware/upload-file.middleware';

const router = Router();

/**
 * @route   GET /api/files/user?userId=...&limit=...&skip=...
 * @desc    Get files by user
 * @access  Private
 */
router.get('/user', FileController.getByUser);

/**
 * @route   GET /api/files/type?mimeType=...&limit=...&skip=...
 * @desc    Get files by mimeType
 * @access  Private
 */
router.get('/type', FileController.getByMimeType);

/**
 * @route   GET /api/files/search?filename=...&limit=...&skip=...
 * @desc    Search files by filename
 * @access  Private
 */
router.get('/search', FileController.getByFilename);

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
router.post('/upload', singleFileUpload, FileController.upload);

/**
 * @route   DELETE /api/files/:fileId
 * @desc    Delete file
 * @access  Private
 */
router.delete('/:fileId', FileController.delete);

export default router;