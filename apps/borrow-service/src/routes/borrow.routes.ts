import { Router } from 'express';
import BorrowController from '../controllers/borrow.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

/**
 * @openapi
 * /borrows:
 *   get:
 *     summary: Lấy danh sách mượn sách
 *     tags:
 *       - Borrow
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
 *         description: Danh sách mượn sách
 */
router.get('/', BorrowController.getList);

/**
 * @openapi
 * /borrows/history:
 *   get:
 *     summary: Lấy lịch sử mượn sách của user
 *     tags:
 *       - Borrow
 *     security:
 *       - bearerAuth: []
 *       - apiKeyAuth: []
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
 *         description: Lịch sử mượn sách
 */
router.get('/history', authenticate, BorrowController.getHistory);

/**
 * @openapi
 * /borrows/{id}:
 *   get:
 *     summary: Lấy thông tin mượn sách theo ID
 *     tags:
 *       - Borrow
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Borrow ID
 *     responses:
 *       200:
 *         description: Thông tin mượn sách
 *       404:
 *         description: Không tìm thấy bản ghi mượn
 */
router.get('/:id', BorrowController.getById);

/**
 * @openapi
 * /borrows:
 *   post:
 *     summary: Tạo mới bản ghi mượn sách
 *     tags:
 *       - Borrow
 *     security:
 *       - bearerAuth: []
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BorrowDto'
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post('/', authenticate, BorrowController.create);

/**
 * @openapi
 * /borrows/{id}:
 *   patch:
 *     summary: Cập nhật bản ghi mượn sách
 *     tags:
 *       - Borrow
 *     security:
 *       - bearerAuth: []
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Borrow ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BorrowDto'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.patch('/:id', authenticate, BorrowController.update);

/**
 * @openapi
 * /borrows/{id}:
 *   delete:
 *     summary: Xóa bản ghi mượn sách
 *     tags:
 *       - Borrow
 *     security:
 *       - bearerAuth: []
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Borrow ID
 *     responses:
 *       200:
 *         description: Xóa thành công
 */
router.delete('/:id', authenticate, BorrowController.delete);

/**
 * @openapi
 * /borrows/{id}/extend:
 *   put:
 *     summary: Gia hạn mượn sách
 *     tags:
 *       - Borrow
 *     security:
 *       - bearerAuth: []
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Borrow ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               extraDays:
 *                 type: integer
 *                 description: Số ngày muốn gia hạn thêm
 *     responses:
 *       200:
 *         description: Gia hạn thành công
 */
router.put('/:id/extend', authenticate, BorrowController.extend);

/**
 * @openapi
 * /borrows/{id}/return:
 *   put:
 *     summary: Trả sách
 *     tags:
 *       - Borrow
 *     security:
 *       - bearerAuth: []
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Borrow ID
 *     responses:
 *       200:
 *         description: Trả sách thành công
 */
router.put('/:id/return', authenticate, BorrowController.return);

export default router;