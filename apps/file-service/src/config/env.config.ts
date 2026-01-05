
import { config } from '@idoc-api/config';

// ────────────────────────────────────────────────────────────────────────────────
// App Config
// ────────────────────────────────────────────────────────────────────────────────
export const PORT = config.services.file.port; // Using file service port
export const NODE_ENV = config.app.env;

// ────────────────────────────────────────────────────────────────────────────────
// URLs
// ────────────────────────────────────────────────────────────────────────────────
export const FRONTEND_URL = config.urls.frontend;
export const BASE_URL = config.urls.base;
export const API_URL = config.urls.api;
export const ALLOWED_ORIGINS = config.app.allowedOrigins;

// ────────────────────────────────────────────────────────────────────────────────
// Database (Mongo DB)
// ────────────────────────────────────────────────────────────────────────────────
// Use service specific DB if available, otherwise fallback (or fail if schema requires it)
export const MONGODB_URI = config.services.file.dbUri || config.db.mongoUri;

// ────────────────────────────────────────────────────────────────────────────────
// API Keys
// ────────────────────────────────────────────────────────────────────────────────
export const API_KEY = config.auth.apiKey;

// ────────────────────────────────────────────────────────────────────────────────
// MinIO Config
// ────────────────────────────────────────────────────────────────────────────────
export const MINIO_ENDPOINT = config.storage.minio.endPoint;
export const MINIO_PORT = config.storage.minio.port;
export const MINIO_USE_SSL = config.storage.minio.useSSL;
export const MINIO_ACCESS_KEY = config.storage.minio.accessKey;
export const MINIO_SECRET_KEY = config.storage.minio.secretKey;
export const MINIO_BUCKET = config.storage.minio.bucket;

// ────────────────────────────────────────────────────────────────────────────────
// Cloudinary Config
// ────────────────────────────────────────────────────────────────────────────────
export const CLOUDINARY_CLOUD_NAME = config.storage.cloudinary.cloudName;
export const CLOUDINARY_API_KEY = config.storage.cloudinary.apiKey;
export const CLOUDINARY_API_SECRET = config.storage.cloudinary.apiSecret;

// ────────────────────────────────────────────────────────────────────────────────
// Redis Config
// ────────────────────────────────────────────────────────────────────────────────
export const REDIS_HOST = config.redis.host;
export const REDIS_PORT = config.redis.port;
export const REDIS_PASSWORD = config.redis.password;
export const REDIS_DB = config.redis.db;
const REDIS_AUTH = REDIS_PASSWORD ? `:${REDIS_PASSWORD}@` : '';
export const REDIS_URI = `redis://${REDIS_AUTH}${REDIS_HOST}:${REDIS_PORT}`;

// ────────────────────────────────────────────────────────────────────────────────
// Auth / Keys
// ────────────────────────────────────────────────────────────────────────────────
const RAW_RSA_PUBLIC_KEY = config.auth.rsaPublicKey;
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