import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import passport from 'passport';

import routes from './routes';
import { FRONTEND_URL } from './config/env.config';
import { errorHandler } from './middleware/error-handler.middleware';


const app = express();

// 1. CORS: Cho phép FE truy cập API, cấu hình domain, header, method
app.use(
  cors({
    credentials: true,
    origin: FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
// 2. Body parser: Đọc JSON và form data từ request
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 3. Cookie parser: Đọc cookie từ request
app.use(cookieParser());

// 4. Logger: Log request ra console (dev)
app.use(morgan('dev'));

// 5. Helmet: Thêm các header bảo mật cho API
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// 6. Passport: Khởi tạo xác thực (nếu dùng passport)
app.use(passport.initialize());

// 7. Định nghĩa route gốc (trang chủ API)
app.get('/', (req, res) => {
  res.json({
    message: 'iDoc API',
    version: '1.0.0',
    endpoints: {
      files: '/api/files',
    }
  });
});

// 8. Định nghĩa các route chính
app.use('/api', routes);

// 9. Health check endpoint
app.get('/healthcheck', (req, res) => {
  res.status(200).send('OK');
});

// 10. Middleware xử lý lỗi tổng quát (luôn đặt cuối cùng)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    status: 404,
    message: 'Route not found',
    data: null,
    error: []
  });
});
app.use(errorHandler);

export default app;