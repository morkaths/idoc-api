import express from 'express';

import categoryRoutes from './category.routes';
import authorRoutes from './author.routes';
import bookRoutes from './book.routes';
import fileRoutes from './file.routes';

const router = express.Router();

// routes
router.use('/categories', categoryRoutes);
router.use('/authors', authorRoutes)
router.use('/books', bookRoutes);
router.use('/files', fileRoutes);


export default router;