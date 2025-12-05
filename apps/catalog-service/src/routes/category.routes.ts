import { Router } from 'express';
import CategoryController from '../controllers/category.controller';
import { authenticateToken, authorizeRole } from '../middleware/auth.middleware';
import { RoleEnum } from '../constants/security/role';

const router = Router();

/**
 * @route   GET /api/categories?page=...&limit=...&lang=...
 * @desc    Get all categories with translations based on language query
 * @access  Public
 * @query   page - Page number (default: 1)
 * @query   limit - Items per page (default: 10)
 * @query   lang - Language code for translations
 * @query   query - Search keyword
 * @query   [other filters] - Any other filter fields
 */
router.get('/', CategoryController.getList);

/**
 * @route   GET /api/categories/:id?lang=...
 * @desc    Get category by ID and language
 * @access  Public
 * @param   id - Category ID
 * @query   lang - Language code for translations
 */
router.get('/:id', CategoryController.getById);

/**
 * @route   POST /api/categories
 * @desc    Create a new category
 * @access  Private
 * @body    CategoryDto - Category data
 */
router.post(
  '/',
  authenticateToken,
  authorizeRole([RoleEnum.ADMIN, RoleEnum.MANAGER, RoleEnum.STAFF]),
  CategoryController.create
);

/**
 * @route   PATCH /api/categories/:id
 * @desc    Update a category by ID
 * @access  Private
 * @param   id - Category ID
 * @body    CategoryDto - Category data
 */
router.patch(
  '/:id',
  authenticateToken,
  authorizeRole([RoleEnum.ADMIN, RoleEnum.MANAGER, RoleEnum.STAFF]),
  CategoryController.update
);

/**
 * @route   DELETE /api/categories/:id
 * @desc    Delete a category by ID
 * @access  Private
 * @param   id - Category ID
 */
router.delete(
  '/:id',
  authenticateToken,
  authorizeRole([RoleEnum.ADMIN, RoleEnum.MANAGER, RoleEnum.STAFF]),
  CategoryController.delete
);

export default router;