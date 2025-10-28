import { Router } from 'express';
import BookController from '../controllers/book.controller';

const router = Router();

/**
 * @route   GET /api/books?lang=...
 * @desc    Get all books with translations based on language query
 * @access  Public
 * @query   lang - Language code for translations
 */
router.get('/', BookController.getAll);

/**
 * @route   GET /api/books/:id?lang=...
 * @desc    Get a book by ID with translation based on language query
 * @access  Public
 * @param   id - Book ID
 * @query   lang - Language code for translations
 */
router.get('/:id', BookController.getById);
/**
 * @route   GET /api/books/search?lang=...&query=...
 * @desc    Search books with translations based on language query and other search parameters
 * @access  Public
 * @query   lang - Language code for translations
 * @query   ... - Other search parameters (title, subtitle, description, etc.)
 */
router.get('/search', BookController.search);

/**
 * @route   POST /api/books
 * @desc    Create a new book with translation
 * @access  Private
 * @body    BookDto - Book data transfer object
 */
router.post('/', BookController.create);

/**
 * @route   PUT /api/books/:id?lang=...
 * @desc    Update a book and its translation based on language query
 * @access  Private
 * @param   id - Book ID
 * @query   lang - Language code for translations
 * @body    Partial<BookDto> - Partial book data transfer object
 */
router.put('/:id', BookController.updateBook);

/**
 * @route   PUT /api/books/:id/translation
 * @desc    Update only the translation of a book
 * @access  Private
 * @param   id - Book ID
 * @body    { lang: string; title?: string; subtitle?: string; description?: string; } - Translation data
 */
router.put('/:id/translation', BookController.updateTranslation);

/**
 * @route   DELETE /api/books/:id
 * @desc    Delete a book by ID
 * @access  Private
 * @param   id - Book ID
 */
router.delete('/:id', BookController.delete);

export default router;