
import dotenv from 'dotenv';
dotenv.config();

const parseNumber = (v?: string, d = 0) => (v ? Number(v) : d);
const parseList = (v?: string) => (v ? v.split(',').map(s => s.trim()).filter(Boolean) : []);

// ────────────────────────────────────────────────────────────────────────────────
// App Config
// ────────────────────────────────────────────────────────────────────────────────
export const PORT = parseNumber(process.env.PORT, 5002);
export const NODE_ENV = process.env.NODE_ENV || 'development';

// ────────────────────────────────────────────────────────────────────────────────
// URLs
// ────────────────────────────────────────────────────────────────────────────────
export const BASE_URL = process.env.BASE_URL || 'http://localhost:5002';
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
