import express from 'express';

import categoryRoutes from './category.routes';

const router = express.Router();

// routes
router.use('/categories', categoryRoutes);

export default router;