
import dotenv from 'dotenv';
dotenv.config();

// ────────────────────────────────────────────────────────────────────────────────
// URLs
// ────────────────────────────────────────────────────────────────────────────────
export const PORT = process.env.PORT || 5002;
export const BASE_URL = process.env.BASE_URL || 'http://localhost:5002';
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
export const API_URL = process.env.API_URL || 'http://localhost:8080/api';

// ────────────────────────────────────────────────────────────────────────────────
// Database (Mongo DB)
// ────────────────────────────────────────────────────────────────────────────────
export const MONGODB_URI = process.env.MONGODB_URI
	? process.env.MONGODB_URI
	: (() => {
		throw new Error('MONGODB_URI chưa được định nghĩa trong file .env');
	})();

// ────────────────────────────────────────────────────────────────────────────────
// API Keys
// ────────────────────────────────────────────────────────────────────────────────
export const API_KEY = process.env.API_KEY
	? process.env.API_KEY
	: (() => {
		throw new Error('API_KEY is not defined in environment variables');
	})();


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
export const MINIO_BUCKET = process.env.MINIO_BUCKET || 'idoc';

// ────────────────────────────────────────────────────────────────────────────────
// Redis Config
// ────────────────────────────────────────────────────────────────────────────────
export const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
export const REDIS_PORT = Number(process.env.REDIS_PORT) || 6379;
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD || '';
export const REDIS_DB = Number(process.env.REDIS_DB) || 0;