import { Router } from 'express';
import CategoryController from '../controllers/category.controller';
import { authenticateToken, authorizeRole } from '../middleware/auth';
import { RoleEnum } from '../constants/security/role';

const router = Router();

/**
 * @route   GET /api/categories?lang=...
 * @desc    Get all categories with translations based on language query
 * @access  Public
 * @query   lang - Language code for translations
 */
router.get('/', CategoryController.getAll);

/**
 * @route   GET /api/categories/search?query=...
 * @desc    Search categories by query and language
 * @access  Public
 * @query   query - Search keyword
 * @query   lang - Language code for translations
 */
router.get('/search', CategoryController.search);

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