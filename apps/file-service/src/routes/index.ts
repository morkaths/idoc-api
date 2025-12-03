import express from 'express';

import categoryRoutes from './category.routes';
import authorRoutes from './author.routes';
import bookRoutes from './book.routes';

const router = express.Router();

// routes
router.use('/categories', categoryRoutes);
router.use('/authors', authorRoutes)
router.use('/books', bookRoutes);

export default router;