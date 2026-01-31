import { Router } from 'express';
import BookmarkController from '../controllers/bookmark.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

/**
 * @openapi
 * /bookmarks:
 *   get:
 *     summary: Lấy danh sách bookmark
 *     tags:
 *       - Bookmark
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Trang hiện tại
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Số lượng mỗi trang
 *     responses:
 *       200:
 *         description: Danh sách bookmark
 */
router.get('/', BookmarkController.getList);

/**
 * @openapi
 * /bookmarks/status:
 *   post:
 *     summary: Kiểm tra trang thái bookmark theo danh sách Item ID
 *     tags:
 *       - Bookmark
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Map trang thái bookmark (itemId -> bookmarkId | null)
 */
router.post(
  '/status',
  authenticate,
  BookmarkController.status
);

/**
 * @openapi
 * /bookmarks/batch:
 *   post:
 *     summary: Lấy nhiều bookmark theo danh sách ID
 *     tags:
 *       - Bookmark
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Danh sách Bookmark ID
 *     responses:
 *       200:
 *         description: Danh sách bookmark
 */
router.post('/batch', BookmarkController.getByIds);

/**
 * @openapi
 * /bookmarks:
 *   post:
 *     summary: Tạo mới bookmark
 *     tags:
 *       - Bookmark
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookmarkDto'
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post(
  '/',
  authenticate,
  BookmarkController.create
);

/**
 * @openapi
 * /bookmarks/bulk:
 *   post:
 *     summary: Tạo nhiều bookmark cùng lúc
 *     tags:
 *       - Bookmark
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/BookmarkDto'
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post(
  '/bulk',
  authenticate,
  BookmarkController.createMany
);

/**
 * @openapi
 * /bookmarks/bulk:
 *   patch:
 *     summary: Cập nhật nhiều bookmark
 *     tags:
 *       - Bookmark
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookmarkDto'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.patch(
  '/bulk',
  authenticate,
  BookmarkController.updateMany
);

/**
 * @openapi
 * /bookmarks/{id}:
 *   get:
 *     summary: Lấy bookmark theo ID
 *     tags:
 *       - Bookmark
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin bookmark
 *       404:
 *         description: Không tìm thấy
 */
router.get('/:id', BookmarkController.getById);

/**
 * @openapi
 * /bookmarks/{id}:
 *   patch:
 *     summary: Cập nhật bookmark
 *     tags:
 *       - Bookmark
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookmarkDto'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.patch(
  '/:id',
  authenticate,
  BookmarkController.update
);

/**
 * @openapi
 * /bookmarks/{id}:
 *   delete:
 *     summary: Xóa bookmark
 *     tags:
 *       - Bookmark
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
  BookmarkController.delete
);

export default router;
