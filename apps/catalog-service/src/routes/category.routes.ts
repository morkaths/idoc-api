import { Router } from 'express';
import CategoryController from '../controllers/category.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { RoleEnum } from '../constants/security/role';
import { uploadExcel } from '../middleware/upload.middleware';

const router = Router();

/**
 * @openapi
 * /categories:
 *   get:
 *     summary: Lấy danh sách category (có dịch)
 *     tags:
 *       - Category
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
 *         name: lang
 *         schema:
 *           type: string
 *         description: Mã ngôn ngữ
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm
 *     responses:
 *       200:
 *         description: Danh sách category
 */
router.get('/', CategoryController.getList);

/**
 * @openapi
 * /categories/batch:
 *   post:
 *     summary: Lấy nhiều category theo danh sách ID
 *     tags:
 *       - Category
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
 *                 description: Danh sách Category ID
 *     responses:
 *       200:
 *         description: Danh sách category
 *       400:
 *         description: Danh sách ID không hợp lệ
 */
router.post('/batch', CategoryController.getByIds);

/**
 * @openapi
 * /categories/export/excel:
 *   get:
 *     summary: Export danh sách category ra Excel
 *     tags:
 *       - Category
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
router.get('/export/excel', CategoryController.exportExcel);

/**
 * @openapi
 * /categories/import/excel:
 *   post:
 *     summary: Import danh sách category từ Excel
 *     tags:
 *       - Category
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
  CategoryController.importExcel
);

/**
 * @openapi
 * /categories:
 *   post:
 *     summary: Tạo mới category
 *     tags:
 *       - Category
 *     security:
 *       - bearerAuth: []
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryDto'
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
  CategoryController.create
);

/**
 * @openapi
 * /categories/bulk:
 *   post:
 *     summary: Tạo nhiều category cùng lúc
 *     tags:
 *       - Category
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
 *               $ref: '#/components/schemas/CategoryDto'
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
  CategoryController.createMany
);

/**
 * @openapi
 * /categories/bulk:
 *   patch:
 *     summary: Cập nhật nhiều category theo điều kiện (filters)
 *     tags:
 *       - Category
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
 *             $ref: '#/components/schemas/CategoryDto'
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
  CategoryController.updateMany
);

/**
 * @openapi
 * /categories/{id}:
 *   get:
 *     summary: Lấy category theo ID (có dịch)
 *     tags:
 *       - Category
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Category ID
 *       - in: query
 *         name: lang
 *         schema:
 *           type: string
 *         description: Mã ngôn ngữ
 *     responses:
 *       200:
 *         description: Thông tin category
 *       404:
 *         description: Không tìm thấy category
 */
router.get('/:id', CategoryController.getById);

/**
 * @openapi
 * /categories/{id}:
 *   patch:
 *     summary: Cập nhật category
 *     tags:
 *       - Category
 *     security:
 *       - bearerAuth: []
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryDto'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       401:
 *         description: Chưa đăng nhập hoặc không có API Key
 *       403:
 *         description: Không đủ quyền truy cập
 *       404:
 *         description: Không tìm thấy category
 */
router.patch(
  '/:id',
  authenticate,
  authorize([RoleEnum.ADMIN, RoleEnum.MANAGER, RoleEnum.STAFF]),
  CategoryController.update
);

/**
 * @openapi
 * /categories/{id}:
 *   delete:
 *     summary: Xóa category
 *     tags:
 *       - Category
 *     security:
 *       - bearerAuth: []
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       401:
 *         description: Chưa đăng nhập hoặc không có API Key
 *       403:
 *         description: Không đủ quyền truy cập
 *       404:
 *         description: Không tìm thấy category
 */
router.delete(
  '/:id',
  authenticate,
  authorize([RoleEnum.ADMIN, RoleEnum.MANAGER, RoleEnum.STAFF]),
  CategoryController.delete
);

export default router;