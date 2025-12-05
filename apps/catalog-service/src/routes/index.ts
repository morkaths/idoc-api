import express from 'express';

import categoryRoutes from './category.routes';
import authorRoutes from './author.routes';
import bookRoutes from './book.routes';
import documentRoutes from './document.routes';

const router = express.Router();

// routes
router.use('/categories', categoryRoutes);
router.use('/authors', authorRoutes)
router.use('/books', bookRoutes);
router.use('/documents', documentRoutes);


export default router;