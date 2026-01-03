
import dotenv from 'dotenv';
dotenv.config();

const parseNumber = (v?: string, d = 0) => (v ? Number(v) : d);
const parseList = (v?: string) => (v ? v.split(',').map(s => s.trim()).filter(Boolean) : []);

// ────────────────────────────────────────────────────────────────────────────────
// App Config
// ────────────────────────────────────────────────────────────────────────────────
export const PORT = parseNumber(process.env.PORT, 5003);
export const NODE_ENV = process.env.NODE_ENV || 'development';

// ────────────────────────────────────────────────────────────────────────────────
// URLs
// ────────────────────────────────────────────────────────────────────────────────
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
export const BASE_URL = process.env.BASE_URL || 'http://localhost:5003';
export const API_URL = process.env.API_URL || 'http://localhost:8080/api';
export const ALLOWED_ORIGINS = parseList(process.env.ALLOWED_ORIGINS);

// ────────────────────────────────────────────────────────────────────────────────
// Database (Mongo DB)
// ────────────────────────────────────────────────────────────────────────────────
export const MONGODB_URI = process.env.MONGODB_URI
  ? process.env.MONGODB_URI
  : (() => { throw new Error('MONGODB_URI chưa được định nghĩa trong file .env'); })();

// ────────────────────────────────────────────────────────────────────────────────
// API Keys
// ────────────────────────────────────────────────────────────────────────────────
export const API_KEY = process.env.API_KEY
  ? process.env.API_KEY
  : (() => { throw new Error('API_KEY is not defined in environment variables'); })();


// ────────────────────────────────────────────────────────────────────────────────
// MinIO Config
// ────────────────────────────────────────────────────────────────────────────────
export const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT || 'localhost';
export const MINIO_PORT = Number(process.env.MINIO_PORT) || 9000;
export const MINIO_USE_SSL = process.env.MINIO_USE_SSL === 'true';
export const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY
  ? process.env.MINIO_ACCESS_KEY
  : (() => { throw new Error('MINIO_ACCESS_KEY is not defined in environment variables'); })();
export const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY
  ? process.env.MINIO_SECRET_KEY
  : (() => { throw new Error('MINIO_SECRET_KEY is not defined in environment variables'); })();
export const MINIO_BUCKET = process.env.MINIO_BUCKET || '';

// ────────────────────────────────────────────────────────────────────────────────
// Cloudinary Config
// ────────────────────────────────────────────────────────────────────────────────
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || '';
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY
  ? process.env.CLOUDINARY_API_KEY
  : (() => { throw new Error('CLOUDINARY_API_KEY is not defined in environment variables'); })();

export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET
  ? process.env.CLOUDINARY_API_SECRET
  : (() => { throw new Error('CLOUDINARY_API_SECRET is not defined in environment variables'); })();

// ────────────────────────────────────────────────────────────────────────────────
// Redis Config
// ────────────────────────────────────────────────────────────────────────────────
export const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
export const REDIS_PORT = Number(process.env.REDIS_PORT) || 6379;
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD || '';
export const REDIS_DB = Number(process.env.REDIS_DB) || 0;

// ────────────────────────────────────────────────────────────────────────────────
// Auth / Keys
// ────────────────────────────────────────────────────────────────────────────────
const RAW_RSA_PUBLIC_KEY = process.env.RSA_PUBLIC_KEY || '';
export const RSA_PUBLIC_KEY = (() => {
  if (!RAW_RSA_PUBLIC_KEY) return '';
  const cleanKey = RAW_RSA_PUBLIC_KEY
    .replace(/\\n/g, '')
    .replace(/\s/g, '')
    .replace(/"/g, '');
  const coreKey = cleanKey
    .replace('-----BEGINPUBLICKEY-----', '')
    .replace('-----ENDPUBLICKEY-----', '');
  return `-----BEGIN PUBLIC KEY-----\n${coreKey}\n-----END PUBLIC KEY-----`;
})();