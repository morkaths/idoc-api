import { Request } from 'express';
import { AuthUser } from '@libs/schema';
export * from '@libs/schema';

export interface AuthRequest extends Request {
  user: AuthUser;
}

export interface UploadRequest extends AuthRequest {
  file: Express.Multer.File;
}

export interface MultipleUploadRequest extends AuthRequest {
  files: Express.Multer.File[];
}