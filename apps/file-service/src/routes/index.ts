import express from 'express';

import fileRoutes from './file.routes';
import imageRoutes from './image.routes';

const router = express.Router();

// routes
router.use('/files', fileRoutes);
router.use('/images', imageRoutes);

export default router;