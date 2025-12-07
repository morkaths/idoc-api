// ...existing code...
import { Router } from 'express';
import FileController from '../controllers/file.controller';
import { authenticate } from '../middleware/auth.middleware';
import { singleFileUpload } from '../middleware/upload-file.middleware';

const router = Router();

/**
 * @openapi
 * /files:
 *   get:
 *     summary: Lấy danh sách file
 *     tags:
 *       - File
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Số lượng file trả về trên mỗi trang
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *         description: Số lượng file bỏ qua
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm (tên file, mô tả, tag)
 *     responses:
 *       200:
 *         description: Danh sách file
 */
router.get('/', FileController.getList);

/**
 * @openapi
 * /files/user:
 *   get:
 *     summary: Lấy danh sách file theo user
 *     tags:
 *       - File
 *     security:
 *       - bearerAuth: []
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của user
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Số lượng kết quả trả về trên mỗi trang, mặc định 20
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *         description: Số lượng bản ghi bỏ qua cho pagination (offset)
 *     responses:
 *       200:
 *         description: Danh sách file của user
 *       401:
 *         description: Chưa đăng nhập hoặc không có API Key
 *       403:
 *         description: Không đủ quyền truy cập
 */
router.get('/user', authenticate, FileController.getByUser);

/**
 * @openapi
 * /files/{key}:
 *   get:
 *     summary: Lấy metadata file theo key
 *     tags:
 *       - File
 *     parameters:
 *       - in: path
 *         name: key
 *         schema:
 *           type: string
 *         required: true
 *         description: Khóa định danh file lưu trên storage (ví dụ: folder/uuid.ext)
 *     responses:
 *       200:
 *         description: Metadata file
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 key:
 *                   type: string
 *                   description: Khóa file trên storage
 *                 fileName:
 *                   type: string
 *                   description: Tên file gốc do user đặt
 *                 contentType:
 *                   type: string
 *                   description: MIME type của file (ví dụ: application/pdf, image/png)
 *                 size:
 *                   type: integer
 *                   description: Kích thước file tính bằng bytes
 *                 userId:
 *                   type: string
 *                   description: ID của người upload
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Thời gian tạo metadata
 *       404:
 *         description: Không tìm thấy file
 */
router.get('/:key', FileController.getByKey);

/**
 * @openapi
 * /files/{key}/download:
 *   get:
 *     summary: Download file theo key
 *     tags:
 *       - File
 *     parameters:
 *       - in: path
 *         name: key
 *         schema:
 *           type: string
 *         required: true
 *         description: Khóa định danh file trên storage để tải về
 *     responses:
 *       200:
 *         description: File trả về dạng binary
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Không tìm thấy file
 */
router.get('/:key/download', FileController.download);

/**
 * @openapi
 * /files/upload/url:
 *   post:
 *     summary: Lấy presigned upload URL
 *     tags:
 *       - File
 *     security:
 *       - bearerAuth: []
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FileUploadUrl'
 *     responses:
 *       200:
 *         description: URL upload
 *       401:
 *         description: Chưa đăng nhập hoặc không có API Key
 *       403:
 *         description: Không đủ quyền truy cập
 */
router.post('/upload/url', authenticate, FileController.getUploadUrl);

/**
 * @openapi
 * /files/upload/confirm:
 *   post:
 *     summary: Xác nhận upload file
 *     tags:
 *       - File
 *     security:
 *       - bearerAuth: []
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FileConfirm'
 *     responses:
 *       201:
 *         description: Lưu metadata thành công
 *       401:
 *         description: Chưa đăng nhập hoặc không có API Key
 *       403:
 *         description: Không đủ quyền truy cập
 */
router.post('/upload/confirm', authenticate, FileController.confirm);

/**
 * @openapi
 * /files/upload:
 *   post:
 *     summary: Upload file trực tiếp
 *     tags:
 *       - File
 *     security:
 *       - bearerAuth: []
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/FileUpload'
 *     responses:
 *       201:
 *         description: Upload thành công
 *       401:
 *         description: Chưa đăng nhập hoặc không có API Key
 *       403:
 *         description: Không đủ quyền truy cập
 */
router.post('/upload', authenticate, singleFileUpload, FileController.upload);

/**
 * @openapi
 * /files/{key}:
 *   delete:
 *     summary: Xóa file theo key
 *     tags:
 *       - File
 *     security:
 *       - bearerAuth: []
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: key
 *         schema:
 *           type: string
 *         required: true
 *         description: Khóa file trên storage cần xóa. Nếu file chưa tồn tại sẽ trả về 404.
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       401:
 *         description: Chưa đăng nhập hoặc không có API Key
 *       403:
 *         description: Không đủ quyền truy cập
 *       404:
 *         description: Không tìm thấy file
 */
router.delete('/:key', authenticate, FileController.delete);

export default router;