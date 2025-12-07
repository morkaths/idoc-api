import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import passport from 'passport';
import swaggerUi from 'swagger-ui-express';
import { Request, Response, NextFunction } from 'express';

import routes from './routes';
import { ALLOWED_ORIGINS } from './config/env.config';
import { errorHandler } from './middleware/error-handler.middleware';


const app = express();
const swaggerSpec = require('../docs/swagger.js');

// 1. CORS
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
      'x-api-key'
    ],
    exposedHeaders: ['Content-Disposition'],
    optionsSuccessStatus: 200,
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
      docs: '/api/docs',
      files: '/api/files',
    }
  });
});

// 7.1. Swagger UI
app.use('/api/docs', (req: Request, res: Response, next: NextFunction) => {
  const connectHosts = ["'self'", ...ALLOWED_ORIGINS].join(' ');
  const CSP = [
    "default-src 'self'",
    `connect-src ${connectHosts}`,
    "img-src 'self' data:",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'"
  ].join('; ');
  res.setHeader('Content-Security-Policy', CSP);
  next();
}, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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