import { Router } from 'express';
import AuthorController from '../controllers/author.controller';
import { authenticateToken, authorizeRole } from '../middleware/auth.middleware';
import { RoleEnum } from '../constants/security/role';

const router = Router();

/**
 * @route   GET /api/authors?query=...page=...&limit=...
 * @desc    Get list authors
 * @access  Public
 * @filter  filter - Filter parameters   
 */
router.get('/', AuthorController.getList);

/**
 * @route   GET /api/authors/:id
 * @desc    Get author by ID
 * @access  Public
 * @param   id - Author ID
 */
router.get('/:id', AuthorController.getById);

/**
 * @route   POST /api/authors
 * @desc    Create a new author
 * @access  Private
 * @body    AuthorDto - Author data
 */
router.post(
  '/',
  authenticateToken,
  authorizeRole([RoleEnum.ADMIN, RoleEnum.MANAGER, RoleEnum.STAFF]),
  AuthorController.create
);

/**
 * @route   PATCH /api/authors/:id
 * @desc    Update an author by ID
 * @access  Private
 * @param   id - Author ID
 * @body    AuthorDto - Author data
 */
router.patch(
  '/:id',
  authenticateToken,
  authorizeRole([RoleEnum.ADMIN, RoleEnum.MANAGER, RoleEnum.STAFF]),
  AuthorController.update
);

/**
 * @route   DELETE /api/authors/:id
 * @desc    Delete an author by ID
 * @access  Private
 * @param   id - Author ID
 */
router.delete(
  '/:id',
  authenticateToken,
  authorizeRole([RoleEnum.ADMIN, RoleEnum.MANAGER, RoleEnum.STAFF]),
  AuthorController.delete
);

export default router;