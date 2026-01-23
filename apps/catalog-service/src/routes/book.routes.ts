import { Router } from 'express';
import BookController from '../controllers/book.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { RoleEnum } from '../constants/security/role';

import { uploadExcel } from '../middleware/upload.middleware';

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
 * /books/batch:
 *   post:
 *     summary: Lấy nhiều sách theo danh sách ID
 *     tags:
 *       - Book
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
 *                 description: Danh sách Book ID
 *     responses:
 *       200:
 *         description: Danh sách sách
 *       400:
 *         description: Danh sách ID không hợp lệ
 */
router.post('/batch', BookController.getByIds);

/**
 * @openapi
 * /books/export/excel:
 *   get:
 *     summary: Export danh sách sách ra Excel
 *     tags:
 *       - Book
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm
 *     responses:
 *       200:
 *         description: File Excel
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/export/excel', BookController.exportExcel);

/**
 * @openapi
 * /books/import/excel:
 *   post:
 *     summary: Import danh sách sách từ Excel
 *     tags:
 *       - Book
 *     security:
 *       - bearerAuth: []
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Import thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     success:
 *                       type: integer
 *                     errors:
 *                       type: array
 *                       items:
 *                         type: object
 */
router.post(
  '/import/excel',
  authenticate,
  authorize([RoleEnum.ADMIN, RoleEnum.MANAGER]),
  uploadExcel,
  BookController.importExcel
);

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
  authenticate,
  authorize([RoleEnum.ADMIN, RoleEnum.MANAGER, RoleEnum.STAFF]),
  BookController.create
);

/**
 * @openapi
 * /books/bulk:
 *   post:
 *     summary: Tạo nhiều sách cùng lúc
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
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/BookDto'
 *     responses:
 *       201:
 *         description: Tạo thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Chưa xác thực
 */
router.post(
  '/bulk',
  authenticate,
  authorize([RoleEnum.ADMIN, RoleEnum.MANAGER]),
  BookController.createMany
);

/**
 * @openapi
 * /books/bulk:
 *   patch:
 *     summary: Cập nhật nhiều sách theo điều kiện (filters)
 *     tags:
 *       - Book
 *     security:
 *       - bearerAuth: []
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm hoặc các filter khác
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookDto'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Chưa xác thực
 */
router.patch(
  '/bulk',
  authenticate,
  authorize([RoleEnum.ADMIN, RoleEnum.MANAGER]),
  BookController.updateMany
);

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
  authenticate,
  authorize([RoleEnum.ADMIN, RoleEnum.MANAGER, RoleEnum.STAFF]),
  BookController.update.bind(BookController)
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
  authenticate,
  authorize([RoleEnum.ADMIN, RoleEnum.MANAGER, RoleEnum.STAFF]),
  BookController.delete
);

export default router;