import { Router } from 'express';
import bookmarkRoutes from './bookmark.route';
import collectionRoutes from './collection.route';
import reviewRoutes from './review.route';

const router = Router();

router.use('/bookmarks', bookmarkRoutes);
router.use('/collections', collectionRoutes);
router.use('/reviews', reviewRoutes);

export default router;
