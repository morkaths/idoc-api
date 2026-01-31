import { Router } from 'express';
import CollectionController from '../controllers/collection.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

/**
 * @openapi
 * /collections:
 *   get:
 *     summary: Lấy danh sách collection
 *     tags:
 *       - Collection
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
 *         description: Tìm kiếm theo tên hoặc mô tả
 *     responses:
 *       200:
 *         description: Danh sách collection
 */
router.get('/', CollectionController.getList);

/**
 * @openapi
 * /collections/batch:
 *   post:
 *     summary: Lấy nhiều collection theo ID
 *     tags:
 *       - Collection
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
 *         description: Danh sách collection
 */
router.post('/batch', CollectionController.getByIds);

/**
 * @openapi
 * /collections:
 *   post:
 *     summary: Tạo mới collection
 *     tags:
 *       - Collection
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CollectionDto'
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post(
  '/',
  authenticate,
  CollectionController.create
);

/**
 * @openapi
 * /collections/bulk:
 *   post:
 *     summary: Tạo nhiều collection
 *     tags:
 *       - Collection
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/CollectionDto'
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post(
  '/bulk',
  authenticate,
  CollectionController.createMany
);

/**
 * @openapi
 * /collections/bulk:
 *   patch:
 *     summary: Cập nhật nhiều collection
 *     tags:
 *       - Collection
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CollectionDto'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.patch(
  '/bulk',
  authenticate,
  CollectionController.updateMany
);

/**
 * @openapi
 * /collections/{id}:
 *   get:
 *     summary: Lấy collection theo ID
 *     tags:
 *       - Collection
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin collection
 *       404:
 *         description: Không tìm thấy
 */
router.get('/:id', CollectionController.getById);

/**
 * @openapi
 * /collections/{id}:
 *   patch:
 *     summary: Cập nhật collection
 *     tags:
 *       - Collection
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
 *             $ref: '#/components/schemas/CollectionDto'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.patch(
  '/:id',
  authenticate,
  CollectionController.update
);

/**
 * @openapi
 * /collections/{id}:
 *   delete:
 *     summary: Xóa collection
 *     tags:
 *       - Collection
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
  CollectionController.delete
);

export default router;
