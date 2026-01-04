
import dotenv from 'dotenv';
dotenv.config();

const parseNumber = (v?: string, d = 0) => (v ? Number(v) : d);
const parseList = (v?: string) => (v ? v.split(',').map(s => s.trim()).filter(Boolean) : []);

// ────────────────────────────────────────────────────────────────────────────────
// App Config
// ────────────────────────────────────────────────────────────────────────────────
export const PORT = parseNumber(process.env.PORT, 5001);
export const NODE_ENV = process.env.NODE_ENV || 'development';

// ────────────────────────────────────────────────────────────────────────────────
// URLs
// ────────────────────────────────────────────────────────────────────────────────
export const BASE_URL = process.env.BASE_URL || 'http://localhost:5001';
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
export const API_URL = process.env.API_URL || 'http://localhost:8000/api';
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
// Email (SMTP) Configuration
// ────────────────────────────────────────────────────────────────────────────────
export const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
export const SMTP_PORT = parseNumber(process.env.SMTP_PORT, 587);
export const SMTP_USER = process.env.SMTP_USER || '';
export const SMTP_PASS = process.env.SMTP_PASS || '';
export const SMTP_FROM = process.env.SMTP_FROM || '"Thư viện số" <no-reply@example.com>';

// ────────────────────────────────────────────────────────────────────────────────
// Redis Configuration
// ────────────────────────────────────────────────────────────────────────────────
export const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
export const REDIS_PORT = parseNumber(process.env.REDIS_PORT, 6379);
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
export const REDIS_DB = parseNumber(process.env.REDIS_DB, 0);
const REDIS_AUTH = REDIS_PASSWORD ? `:${REDIS_PASSWORD}@` : '';
export const REDIS_URI = process.env.REDIS_URI || `redis://${REDIS_AUTH}${REDIS_HOST}:${REDIS_PORT}`;

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