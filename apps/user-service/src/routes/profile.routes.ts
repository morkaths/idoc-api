import { Router } from 'express';
import ProfileController from '../controllers/profile.controller';
import { authenticateToken, authorizeRole } from '../middleware/auth.middleware';
import { RoleEnum } from 'src/constants/security/role';

const router = Router();

/**
 * @openapi
 * /profiles:
 *   get:
 *     summary: Lấy danh sách hồ sơ người dùng
 *     tags:
 *       - Profile
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
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm
 *     responses:
 *       200:
 *         description: Danh sách hồ sơ
 */
router.get('/', ProfileController.getList);

/**
 * @openapi
 * /profiles/me:
 *   get:
 *     summary: Lấy hồ sơ của chính mình
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *       - apiKeyAuth: []
 *     responses:
 *       200:
 *         description: Hồ sơ cá nhân
 *       401:
 *         description: Chưa xác thực
 */
router.get('/me', authenticateToken, ProfileController.getMe);

/**
 * @openapi
 * /profiles/{id}:
 *   get:
 *     summary: Lấy hồ sơ theo ID
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Profile ID
 *     responses:
 *       200:
 *         description: Thông tin hồ sơ
 *       404:
 *         description: Không tìm thấy hồ sơ
 */
router.get('/:id', ProfileController.getById);

/**
 * @openapi
 * /profiles:
 *   post:
 *     summary: Tạo mới hồ sơ
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProfileDto'
 *     responses:
 *       201:
 *         description: Tạo thành công
 *       401:
 *         description: Chưa xác thực
 */
router.post('/', authenticateToken, ProfileController.create);

/**
 * @openapi
 * /profiles/me:
 *   patch:
 *     summary: Cập nhật hồ sơ cá nhân
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProfileDto'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       401:
 *         description: Chưa xác thực
 */
router.patch('/me', authenticateToken, ProfileController.updateMe);

/**
 * @openapi
 * /profiles/{id}:
 *   patch:
 *     summary: Cập nhật hồ sơ theo ID
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Profile ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProfileDto'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       401:
 *         description: Chưa xác thực
 *       403:
 *         description: Không đủ quyền
 *       404:
 *         description: Không tìm thấy hồ sơ
 */
router.patch('/:id', authenticateToken, authorizeRole([RoleEnum.ADMIN, RoleEnum.MANAGER, RoleEnum.STAFF]), ProfileController.update);

/**
 * @openapi
 * /profiles/{id}:
 *   delete:
 *     summary: Xóa hồ sơ theo ID
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Profile ID
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       401:
 *         description: Chưa xác thực
 *       403:
 *         description: Không đủ quyền
 *       404:
 *         description: Không tìm thấy hồ sơ
 */
router.delete('/:id', authenticateToken, authorizeRole([RoleEnum.ADMIN, RoleEnum.MANAGER, RoleEnum.STAFF]), ProfileController.delete);

export default router;