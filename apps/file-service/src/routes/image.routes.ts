import { Router } from 'express';
import { ImageController } from '../controllers/image.controller';
import { singleImageUpload } from '../middleware/upload-image.middleware';
import { authenticate } from 'src/middleware/auth.middleware';

const router = Router();

/**
 * @openapi
 * /images/upload:
 *   post:
 *     summary: Upload ảnh lên Cloudinary
 *     tags:
 *       - Image
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
 *       201:
 *         description: Upload thành công
 */
router.post('/upload', authenticate, singleImageUpload, ImageController.upload);

/**
 * @openapi
 * /images/delete:
 *   delete:
 *     summary: Xóa ảnh trên Cloudinary bằng URL
 *     tags:
 *       - Image
 *     security:
 *       - bearerAuth: []
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 description: Đường dẫn ảnh Cloudinary
 *     responses:
 *       200:
 *         description: Xóa thành công
 */
router.delete('/delete', authenticate, ImageController.delete);

export default router;