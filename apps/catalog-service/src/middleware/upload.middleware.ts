import multer from 'multer';
import { Request } from 'express';

// Cấu hình multer với memory storage
const storage = multer.memoryStorage();

// Middleware validate file type - chỉ cho phép Excel
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only Excel files are allowed'));
  }
};

// Cấu hình upload với giới hạn
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export const uploadExcel = upload.single('file');
export default upload;
