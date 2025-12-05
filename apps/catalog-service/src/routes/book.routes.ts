import { Router } from 'express';
import BookController from '../controllers/book.controller';
import { authenticateToken, authorizeRole } from '../middleware/auth';
import { RoleEnum } from '../constants/security/role';

const router = Router();

/**
 * @route   GET /api/books?page=...&limit=...&filter=...
 * @desc    Get list books with translations based on filter parameters
 * @access  Public
 * @query   page - Page number (default: 1)
 * @query   limit - Items per page (default: 10)
 * @query   filter - Filter parameters
 */
router.get('/', BookController.getList);

/**
 * @route   GET /api/books/category/:slug?lang=...
 * @desc    Get all books by category ID with translations
 * @access  Public
 * @param   slug - Category slug
 * @query   lang - Language code for translations
 */
router.get('/category/:slug', BookController.getByCategory);

/**
 * @route   GET /api/books/:id?lang=...
 * @desc    Get a book by ID with translation based on language query
 * @access  Public
 * @param   id - Book ID
 * @query   lang - Language code for translations
 */
router.get('/:id', BookController.getById);

/**
 * @route   POST /api/books
 * @desc    Create a new book with translation
 * @access  Private
 * @body    BookDto - Book data transfer object
 */
router.post('/', authenticateToken, authorizeRole([RoleEnum.ADMIN, RoleEnum.MANAGER, RoleEnum.STAFF]), BookController.create);

/**
 * @route   PATCH /api/books/:id
 * @desc    Update a book and its translation based on language query
 * @access  Private
 * @param   id - Book ID
 * @query   lang - Language code for translations
 * @body    Partial<BookDto> - Partial book data transfer object
 */
router.patch('/:id', authenticateToken, authorizeRole([RoleEnum.ADMIN, RoleEnum.MANAGER, RoleEnum.STAFF]), BookController.update);

/**
 * @route   DELETE /api/books/:id
 * @desc    Delete a book by ID
 * @access  Private
 * @param   id - Book ID
 */
router.delete('/:id', authenticateToken, authorizeRole([RoleEnum.ADMIN, RoleEnum.MANAGER, RoleEnum.STAFF]), BookController.delete);

export default router;