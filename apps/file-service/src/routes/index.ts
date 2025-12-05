import express from 'express';

import fileRoutes from './file.routes';

const router = express.Router();

// routes
router.use('/files', fileRoutes);

export default router;