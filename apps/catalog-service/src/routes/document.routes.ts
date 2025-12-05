import { Router } from 'express';
import DocumentController from '../controllers/document.controller';
import { authenticateToken, authorizeRole } from '../middleware/auth.middleware';
import { RoleEnum } from '../constants/security/role';

const router = Router();

/**
 * @route   GET /api/files?lang=...
 * @desc    Get all files (supports translations via lang query)
 * @access  Public
 * @query   lang - Language code for translations
 */
router.get('/', DocumentController.getAll);

/**
 * @route   GET /api/files/search?lang=...&query=...
 * @desc    Search files
 * @access  Public
 */
router.get('/search', DocumentController.search);

/**
 * @route   GET /api/files/category/:categorySlug?lang=...
 * @desc    Get files by category slug
 * @access  Public
 */
router.get('/category/:categorySlug', DocumentController.getByCategory);

/**
 * @route   GET /api/files/:id?lang=...
 * @desc    Get a file by id
 * @access  Public
 */
router.get('/:id', DocumentController.getById);

/**
 * @route   POST /api/files
 * @desc    Create file
 * @access  Private
 */
router.post(
  '/',
  authenticateToken,
  authorizeRole([RoleEnum.ADMIN, RoleEnum.MANAGER, RoleEnum.STAFF]),
  DocumentController.create
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
  DocumentController.update
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
  DocumentController.delete
);

export default router;