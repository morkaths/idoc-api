import express from 'express';

import profileRoutes from './profile.routes';

const router = express.Router();

// routes
router.use('/profiles', profileRoutes);

export default router;