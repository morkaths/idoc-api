import { Router } from 'express';
import ProfileController from '../controllers/profile.controller';
import { authenticateToken, authorizeRole } from '../middleware/auth.middleware';
import { RoleEnum } from 'src/constants/security/role';

const router = Router();

/**
 * @route   GET /api/profiles
 * @desc    Get all profiles
 * @access  Public
 */
router.get('/', ProfileController.getAll);

/**
 * @route   GET /api/profiles/me
 * @desc    Get current user's profile
 * @access  Private (Authentication users only)
 */
router.get('/me', authenticateToken, ProfileController.getMe);

/**
 * @route   GET /api/profiles/search?query=...
 * @desc    Search profiles (fullName, bio, location)
 * @access  Public
 * @query   query (string, required)
 */
router.get('/search', ProfileController.search);

/**
 * @route   GET /api/profiles/:id
 * @desc    Get profile by ID
 * @access  Public
 */
router.get('/:id', ProfileController.getById);

/**
 * @route   POST /api/profiles
 * @desc    Create a new profile
 * @access  Private (Authentication users only)
 */
router.post('/', authenticateToken, ProfileController.create);

/**
 * @route   PUT /api/profiles/me
 * @desc    Update current user's profile
 * @access  Private (Authentication users only)
 */
router.patch('/me', authenticateToken, ProfileController.updateMe);

/**
 * @route   PUT /api/profiles/:id
 * @desc    Update profile by ID
 * @access  Private (Authentication users only)
 */
router.patch('/:id', authenticateToken, authorizeRole([RoleEnum.ADMIN, RoleEnum.MANAGER, RoleEnum.STAFF]), ProfileController.update);

/**
 * @route   DELETE /api/profiles/:id
 * @desc    Delete profile by ID
 * @access  Private (Authentication users only)
 */
router.delete('/:id', authenticateToken, authorizeRole([RoleEnum.ADMIN, RoleEnum.MANAGER, RoleEnum.STAFF]), ProfileController.delete);

export default router;