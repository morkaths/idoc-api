import express from 'express';

import categoryRoutes from './category.routes';
import bookRoutes from './book.routes';

const router = express.Router();

// routes
router.use('/categories', categoryRoutes);
router.use('/books', bookRoutes);

export default router;