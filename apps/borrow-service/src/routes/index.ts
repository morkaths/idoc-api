import express from 'express';
import borrowRoutes from './borrow.routes';

const router = express.Router();

// routes
router.use('/borrows', borrowRoutes);

export default router;