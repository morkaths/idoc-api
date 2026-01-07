import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { envSchema } from './env.schema';

const findRoot = (dir: string): string => {
  if (fs.existsSync(path.join(dir, 'nx.json'))) {
    return dir;
  }
  const parent = path.dirname(dir);
  if (parent === dir) {
    return process.cwd(); // Fallback to CWD if root not found
  }
  return findRoot(parent);
};

const rootDir = findRoot(process.cwd());
const envPath = path.resolve(rootDir, '.env');
console.log(`[Config] Loading .env from: ${envPath}`);
dotenv.config({ path: envPath });

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('[.ENV] Invalid Environment Variables:');

  const formattedError = parsed.error.format();

  Object.entries(formattedError).forEach(([key, value]) => {
    if (key !== '_errors' && value && '_errors' in value) {
      console.error(`   [${key}]: ${value._errors.join(', ')}`);
    }
  });
  process.exit(1);
}

const env = parsed.data;

export const config = {
  app: {
    env: env.NODE_ENV,
    url: env.API_URL,
    web: env.WEB_URL,
    logLevel: env.LOG_LEVEL,
    allowedOrigins: env.ALLOWED_ORIGINS,
  },
  auth: {
    apiKey: env.API_KEY,
    rsaPublicKey: env.RSA_PUBLIC_KEY,
  },
  services: {
    timeout: env.SERVICE_TIMEOUT,
    gateway: {
      port: env.GATEWAY_PORT,
      url: env.GATEWAY_URL,
    },
    auth: {
      port: env.AUTH_PORT,
      url: env.AUTH_URL,
    },
    statistics: {
      port: env.STATISTICS_PORT,
      url: env.STATISTICS_URL,
    },
    user: {
      port: env.USER_PORT,
      url: env.USER_URL,
      db: env.USER_DB_URI,
    },
    catalog: {
      port: env.CATALOG_PORT,
      url: env.CATALOG_URL,
      db: env.CATALOG_DB_URI,
    },
    file: {
      port: env.FILE_PORT,
      url: env.FILE_URL,
      db: env.FILE_DB_URI,
    },
    borrow: {
      port: env.BORROW_PORT,
      url: env.BORROW_URL,
      db: env.BORROW_DB_URI,
    },
  },
  storage: {
    minio: {
      endPoint: env.MINIO_ENDPOINT,
      port: env.MINIO_PORT,
      bucket: env.MINIO_BUCKET,
      useSSL: env.MINIO_USE_SSL,
      forcePathStyle: env.AWS_S3_FORCE_PATH_STYLE,
      accessKey: env.MINIO_ACCESS_KEY,
      secretKey: env.MINIO_SECRET_KEY,
    },
    cloudinary: {
      cloudName: env.CLOUDINARY_CLOUD_NAME,
      apiKey: env.CLOUDINARY_API_KEY,
      apiSecret: env.CLOUDINARY_API_SECRET,
    }
  },
  email: {
    smtp: {
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
      from: env.SMTP_FROM,
    }
  },
  redis: {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    password: env.REDIS_PASSWORD,
    db: env.REDIS_DB,
    uri: env.REDIS_URI || `redis://${env.REDIS_PASSWORD ? `:${env.REDIS_PASSWORD}@` : ''}${env.REDIS_HOST}:${env.REDIS_PORT}`,
  }
} as const;