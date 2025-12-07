import { Router } from 'express';
import BookController from '../controllers/book.controller';
import { authenticateToken, authorizeRole } from '../middleware/auth.middleware';
import { RoleEnum } from '../constants/security/role';

const router = Router();

/**
 * @openapi
 * /books:
 *   get:
 *     summary: Lấy danh sách sách (có dịch)
 *     tags:
 *       - Book
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
 *         description: Danh sách sách
 */
router.get('/', BookController.getList);

/**
 * @openapi
 * /books/category/{slug}:
 *   get:
 *     summary: Lấy danh sách sách theo category (có dịch)
 *     tags:
 *       - Book
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *         description: Category slug
 *       - in: query
 *         name: lang
 *         schema:
 *           type: string
 *         description: Mã ngôn ngữ
 *     responses:
 *       200:
 *         description: Danh sách sách theo category
 */
router.get('/category/:slug', BookController.getByCategory);

/**
 * @openapi
 * /books/{id}:
 *   get:
 *     summary: Lấy sách theo ID (có dịch)
 *     tags:
 *       - Book
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Book ID
 *       - in: query
 *         name: lang
 *         schema:
 *           type: string
 *         description: Mã ngôn ngữ
 *     responses:
 *       200:
 *         description: Thông tin sách
 *       404:
 *         description: Không tìm thấy sách
 */
router.get('/:id', BookController.getById);

/**
 * @openapi
 * /books:
 *   post:
 *     summary: Tạo mới sách
 *     tags:
 *       - Book
 *     security:
 *       - bearerAuth: []
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookDto'
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
  authenticateToken,
  authorizeRole([RoleEnum.ADMIN, RoleEnum.MANAGER, RoleEnum.STAFF]),
  BookController.create
);

/**
 * @openapi
 * /books/{id}:
 *   patch:
 *     summary: Cập nhật sách
 *     tags:
 *       - Book
 *     security:
 *       - bearerAuth: []
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Book ID
 *       - in: query
 *         name: lang
 *         schema:
 *           type: string
 *         description: Mã ngôn ngữ
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookDto'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       401:
 *         description: Chưa đăng nhập hoặc không có API Key
 *       403:
 *         description: Không đủ quyền truy cập
 *       404:
 *         description: Không tìm thấy sách
 */
router.patch(
  '/:id',
  authenticateToken,
  authorizeRole([RoleEnum.ADMIN, RoleEnum.MANAGER, RoleEnum.STAFF]),
  BookController.update
);

/**
 * @openapi
 * /books/{id}:
 *   delete:
 *     summary: Xóa sách
 *     tags:
 *       - Book
 *     security:
 *       - bearerAuth: []
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       401:
 *         description: Chưa đăng nhập hoặc không có API Key
 *       403:
 *         description: Không đủ quyền truy cập
 *       404:
 *         description: Không tìm thấy sách
 */
router.delete(
  '/:id',
  authenticateToken,
  authorizeRole([RoleEnum.ADMIN, RoleEnum.MANAGER, RoleEnum.STAFF]),
  BookController.delete
);

export default router;