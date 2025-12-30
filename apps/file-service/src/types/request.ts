import { Request } from 'express';
import { User } from './auth.types';

export interface AuthRequest extends Request {
  user: User;
}

export interface UploadRequest extends AuthRequest {
  file: Express.Multer.File;
}

export interface MultipleUploadRequest extends AuthRequest {
  files: Express.Multer.File[];
}