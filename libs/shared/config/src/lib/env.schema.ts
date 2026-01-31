import { z } from 'zod';

export const envSchema = z.object({
  // === APP ===
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  LOG_LEVEL: z.enum(['info', 'debug', 'warn', 'error']).default('info'),
  API_URL: z.string().url().min(1, "[ENV] API URL must have at least 1 character"),
  WEB_URL: z.string().url().min(1, "[ENV] Web URL must have at least 1 character"),

  // === CORS ===
  ALLOWED_ORIGINS: z.string().transform((str) => str.split(/[,\s]+/).map((origin) => origin.trim()).filter(Boolean)),

  // === AUTH / KEYS ===
  API_KEY: z.string().min(1, "[ENV] API key must have at least 1 character"),
  JWT_PUBLIC_KEY: z.string()
    .min(50, "[ENV] JWT public key has less than 50 characters")
    .includes("BEGIN PUBLIC KEY", { message: "[ENV] JWT Key is missing Header 'BEGIN PUBLIC KEY'" })
    .transform((key) => {
      let formatted = key.replace(/^"|"$/g, '');
      formatted = formatted.replace(/\\n/g, '\n');
      return formatted;
    }),

  // === SERVICES ===
  // Service timeout
  SERVICE_TIMEOUT: z.coerce.number().default(10000),

  // Gateway
  GATEWAY_PORT: z.coerce.number().default(5000),
  GATEWAY_URL: z.string().url().min(1, "[ENV] Gateway URL must have at least 1 character"),

  // Auth Service
  AUTH_PORT: z.coerce.number().default(8080),
  AUTH_URL: z.string().url().min(1, "[ENV] Auth URL must have at least 1 character"),

  // Statistics Service
  STATISTICS_PORT: z.coerce.number().default(8085),
  STATISTICS_URL: z.string().url().min(1, "[ENV] Statistics URL must have at least 1 character"),

  // User Service
  USER_PORT: z.coerce.number().default(5001),
  USER_URL: z.string().url().min(1, "[ENV] User URL must have at least 1 character"),
  USER_DB_URI: z.string().startsWith('mongodb', "[ENV] User DB URI must start with 'mongodb://'").url(),

  // Catalog Service
  CATALOG_PORT: z.coerce.number().default(5002),
  CATALOG_URL: z.string().url().min(1, "[ENV] Catalog URL must have at least 1 character"),
  CATALOG_DB_URI: z.string().startsWith('mongodb', "[ENV] Catalog DB URI must start with 'mongodb://'").url(),

  // File Service
  FILE_PORT: z.coerce.number().default(5003),
  FILE_URL: z.string().url().min(1, "[ENV] File URL must have at least 1 character"),
  FILE_DB_URI: z.string().startsWith('mongodb', "[ENV] File DB URI must start with 'mongodb://'").url(),

  // Borrow Service
  BORROW_PORT: z.coerce.number().default(5004),
  BORROW_URL: z.string().url().min(1, "[ENV] Borrow URL must have at least 1 character"),
  BORROW_DB_URI: z.string().startsWith('mongodb', "[ENV] Borrow DB URI must start with 'mongodb://'").url(),

  // Interaction Service
  INTERACTION_PORT: z.coerce.number().default(5005),
  INTERACTION_URL: z.string().url().min(1, "[ENV] Interaction URL must have at least 1 character"),
  INTERACTION_DB_URI: z.string().startsWith('mongodb', "[ENV] Interaction DB URI must start with 'mongodb://'").url(),

  // Recommendation Service
  RECOMMENDATION_PORT: z.coerce.number().default(6000),
  RECOMMENDATION_URL: z.string().url().min(1, "[ENV] Recommendation URL must have at least 1 character"),
  RECOMMENDATION_DB_URI: z.string().startsWith('mongodb', "[ENV] Recommendation DB URI must start with 'mongodb://'").url(),

  // === MINIO / S3 ===
  MINIO_ENDPOINT: z.string().min(1, "[ENV] Minio endpoint must have at least 1 character"),
  MINIO_PORT: z.coerce.number().default(9000),
  MINIO_BUCKET: z.string().min(1, "[ENV] Minio bucket must have at least 1 character"),
  MINIO_USE_SSL: z.enum(['true', 'false']).transform((v) => v === 'true'),
  AWS_S3_FORCE_PATH_STYLE: z.enum(['true', 'false']).transform((v) => v === 'true'),
  MINIO_ACCESS_KEY: z.string().min(1, "[ENV] Minio access key must have at least 1 character"),
  MINIO_SECRET_KEY: z.string().min(1, "[ENV] Minio secret key must have at least 1 character"),

  // === SMTP ===
  SMTP_HOST: z.string().default('smtp.gmail.com'),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().optional().default(''),
  SMTP_PASS: z.string().optional().default(''),
  SMTP_FROM: z.string().optional().default('"Thư viện số" <no-reply@example.com>'),

  // === CLOUDINARY ===
  CLOUDINARY_CLOUD_NAME: z.string().min(1, "[ENV] Cloudinary cloud name must have at least 1 character"),
  CLOUDINARY_API_KEY: z.string().min(1, "[ENV] Cloudinary API key must have at least 1 character"),
  CLOUDINARY_API_SECRET: z.string().min(1, "[ENV] Cloudinary API secret must have at least 1 character"),

  // === REDIS ===
  REDIS_HOST: z.string().min(1, "[ENV] Redis host must have at least 1 character").default('localhost'),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_DB: z.coerce.number().min(0, "[ENV] Redis db must be a non-negative number").default(0),
  REDIS_PASSWORD: z.string().optional().default(''),
  REDIS_URI: z.string().optional(),
});

export type EnvConfig = z.infer<typeof envSchema>;