import { Router } from 'express';
import ReviewController from '../controllers/review.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

/**
 * @openapi
 * /reviews:
 *   get:
 *     summary: Lấy danh sách review
 *     tags:
 *       - Review
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Tìm kiếm trong nội dung review
 *     responses:
 *       200:
 *         description: Danh sách review
 */
router.get('/', ReviewController.getList);

/**
 * @openapi
 * /reviews/batch:
 *   post:
 *     summary: Lấy nhiều review theo ID
 *     tags:
 *       - Review
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Danh sách review
 */
router.post('/batch', ReviewController.getByIds);

/**
 * @openapi
 * /reviews:
 *   post:
 *     summary: Tạo mới review
 *     tags:
 *       - Review
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReviewDto'
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post(
  '/',
  authenticate,
  ReviewController.create
);

/**
 * @openapi
 * /reviews/bulk:
 *   post:
 *     summary: Tạo nhiều review
 *     tags:
 *       - Review
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/ReviewDto'
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post(
  '/bulk',
  authenticate,
  ReviewController.createMany
);

/**
 * @openapi
 * /reviews/bulk:
 *   patch:
 *     summary: Cập nhật nhiều review
 *     tags:
 *       - Review
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReviewDto'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.patch(
  '/bulk',
  authenticate,
  ReviewController.updateMany
);

/**
 * @openapi
 * /reviews/{id}:
 *   get:
 *     summary: Lấy review theo ID
 *     tags:
 *       - Review
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin review
 *       404:
 *         description: Không tìm thấy
 */
router.get('/:id', ReviewController.getById);

/**
 * @openapi
 * /reviews/{id}:
 *   patch:
 *     summary: Cập nhật review
 *     tags:
 *       - Review
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReviewDto'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.patch(
  '/:id',
  authenticate,
  ReviewController.update
);

/**
 * @openapi
 * /reviews/{id}:
 *   delete:
 *     summary: Xóa review
 *     tags:
 *       - Review
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa thành công
 */
router.delete(
  '/:id',
  authenticate,
  ReviewController.delete
);

export default router;
