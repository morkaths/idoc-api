import { Router } from 'express';
import CategoryController from '../controllers/category.controller';

const router = Router();

/**
 * @route   GET /api/categories
 * @desc    Get all categories with translations based on language query
 * @access  Public
 * @query   lang - Language code for translations
 */
router.get('/', CategoryController.getAll);

export default router;