import multer from 'multer';
import { Request } from 'express';

// Cấu hình multer với memory storage
const storage = multer.memoryStorage();

// Middleware validate file type
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Chỉ cho phép ảnh
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedImageTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (JPEG, PNG, GIF, WEBP)'));
  }
};

// Cấu hình upload với giới hạn
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

export const singleImageUpload = upload.single('file');
export const multipleImagesUpload = upload.array('files', 10);