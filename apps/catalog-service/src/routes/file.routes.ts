import { Router } from 'express';
import FileController from '../controllers/file.controller';
import { authenticateToken, authorizeRole } from '../middleware/auth';
import { RoleEnum } from '../constants/security/role';

const router = Router();

/**
 * @route   GET /api/files?lang=...
 * @desc    Get all files (supports translations via lang query)
 * @access  Public
 * @query   lang - Language code for translations
 */
router.get('/', FileController.getAll);

/**
 * @route   GET /api/files/search?lang=...&query=...
 * @desc    Search files
 * @access  Public
 */
router.get('/search', FileController.search);

/**
 * @route   GET /api/files/category/:categorySlug?lang=...
 * @desc    Get files by category slug
 * @access  Public
 */
router.get('/category/:categorySlug', FileController.getByCategory);

/**
 * @route   GET /api/files/:id?lang=...
 * @desc    Get a file by id
 * @access  Public
 */
router.get('/:id', FileController.getById);

/**
 * @route   POST /api/files
 * @desc    Create file
 * @access  Private
 */
router.post(
  '/',
  authenticateToken,
  authorizeRole([RoleEnum.ADMIN, RoleEnum.MANAGER, RoleEnum.STAFF]),
  FileController.create
);

/**
 * @route   PATCH /api/files/:id
 * @desc    Update file
 * @access  Private
 */
router.patch(
  '/:id',
  authenticateToken,
  authorizeRole([RoleEnum.ADMIN, RoleEnum.MANAGER, RoleEnum.STAFF]),
  FileController.update
);

/**
 * @route   DELETE /api/files/:id
 * @desc    Delete file
 * @access  Private
 */
router.delete(
  '/:id',
  authenticateToken,
  authorizeRole([RoleEnum.ADMIN, RoleEnum.MANAGER, RoleEnum.STAFF]),
  FileController.delete
);

export default router;