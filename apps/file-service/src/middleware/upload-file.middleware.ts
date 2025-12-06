import multer from 'multer';
import { Request } from 'express';

// Cấu hình multer với memory storage
const storage = multer.memoryStorage();

// Middleware validate file type - cho phép nhiều loại file
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = [
    // Images
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',

    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx

    // Text
    'text/plain',
    'text/csv',

    // Video
    'video/mp4',
    'video/x-matroska', // .mkv
    'video/quicktime',  // .mov
    'video/x-msvideo',  // .avi
    'video/webm',
    'video/mpeg',

    // Archives
    'application/zip',
    'application/x-rar-compressed',
    'application/x-7z-compressed',
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed`));
  }
};

// Cấu hình upload với giới hạn
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
});

export const singleFileUpload = upload.single('file');
export const multipleFilesUpload = upload.array('files', 10);