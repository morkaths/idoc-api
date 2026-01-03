import { Request } from 'express';
import { z } from 'zod';

export const AuthUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  username: z.string(),
  password: z.string().optional(),
  status: z.number().int(),
  roles: z.array(z.string()).optional(),
  permissions: z.array(z.string()).optional(),
});

export type AuthUser = z.infer<typeof AuthUserSchema>;

export interface AuthRequest extends Request {
  user: AuthUser;
}