import { Router } from 'express';
import BookController from '../controllers/book.controller';
import { authenticateToken, authorizeRole } from '../middleware/auth';
import { RoleEnum } from '../constants/security/role';

const router = Router();

/**
 * @route   GET /api/books?lang=...
 * @desc    Get all books with translations based on language query
 * @access  Public
 * @query   lang - Language code for translations
 */
router.get('/', BookController.getAll);

/**
 * @route   GET /api/books/search?lang=...&query=...
 * @desc    Search books with translations based on language query and other search parameters
 * @access  Public
 * @query   lang - Language code for translations
 * @query   ... - Other search parameters (title, subtitle, description, etc.)
 */
router.get('/search', BookController.search);

/**
 * @route   GET /api/books/category/:categoryName?lang=...
 * @desc    Get all books by category ID with translations
 * @access  Public
 * @param   categorySlug - Category slug
 * @query   lang - Language code for translations
 */
router.get('/category/:categorySlug', BookController.getByCategory);

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