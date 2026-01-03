import { Router } from 'express';
import AuthorController from '../controllers/author.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { RoleEnum } from '../constants/security/role';

const router = Router();

/**
 * @openapi
 * /authors:
 *   get:
 *     summary: Lấy danh sách tác giả
 *     tags:
 *       - Author
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
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm
 *     responses:
 *       200:
 *         description: Danh sách tác giả
 */
router.get('/', AuthorController.getList);

/**
 * @openapi
 * /authors/{id}:
 *   get:
 *     summary: Lấy tác giả theo ID
 *     tags:
 *       - Author
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Author ID
 *     responses:
 *       200:
 *         description: Thông tin tác giả
 *       404:
 *         description: Không tìm thấy tác giả
 */
router.get('/:id', AuthorController.getById);

/**
 * @openapi
 * /authors/batch:
 *   post:
 *     summary: Lấy nhiều tác giả theo danh sách ID
 *     tags:
 *       - Author
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
 *                 description: Danh sách Author ID
 *     responses:
 *       200:
 *         description: Danh sách tác giả
 *       400:
 *         description: Danh sách ID không hợp lệ
 */
router.post('/batch', AuthorController.getByIds);

/**
 * @openapi
 * /authors:
 *   post:
 *     summary: Tạo mới tác giả
 *     tags:
 *       - Author
 *     security:
 *       - bearerAuth: []
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthorDto'
 *     responses:
 *       201:
 *         description: Tạo thành công
 *       401:
 *         description: Chưa đăng nhập hoặc không có API Key
 *       403:
 *         description: Không đủ quyền truy cập
 */
router.post(
  '/',
  authenticate,
  authorize([RoleEnum.ADMIN, RoleEnum.MANAGER, RoleEnum.STAFF]),
  AuthorController.create
);

/**
 * @openapi
 * /authors/{id}:
 *   patch:
 *     summary: Cập nhật tác giả
 *     tags:
 *       - Author
 *     security:
 *       - bearerAuth: []
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Author ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthorDto'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       401:
 *         description: Chưa đăng nhập hoặc không có API Key
 *       403:
 *         description: Không đủ quyền truy cập
 *       404:
 *         description: Không tìm thấy tác giả
 */
router.patch(
  '/:id',
  authenticate,
  authorize([RoleEnum.ADMIN, RoleEnum.MANAGER, RoleEnum.STAFF]),
  AuthorController.update
);

/**
 * @openapi
 * /authors/{id}:
 *   delete:
 *     summary: Xóa tác giả
 *     tags:
 *       - Author
 *     security:
 *       - bearerAuth: []
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Author ID
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       401:
 *         description: Chưa đăng nhập hoặc không có API Key
 *       403:
 *         description: Không đủ quyền truy cập
 *       404:
 *         description: Không tìm thấy tác giả
 */
router.delete(
  '/:id',
  authenticate,
  authorize([RoleEnum.ADMIN, RoleEnum.MANAGER, RoleEnum.STAFF]),
  AuthorController.delete
);

export default router;