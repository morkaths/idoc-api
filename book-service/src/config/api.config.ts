import { profile } from 'console';
import * as ENV from './env.config';

export const API_CONFIG = {
  timeout: 10000,
  baseURLs: {
    auth: ENV.API_URL,
  },
  endpoints: {
    auth: {
      verify: '/auth/verify',
      verifyRole: (id: string) => `/auth/roles/${id}`,
    },
    user: {
      getAll: '/users',
      getById: (id: string) => `/users/${id}`,
      search: '/users/search',
      create: '/users',
      update: (id: string) => `/users/${id}`,
      delete: (id: string) => `/users/${id}`,
    }
  }
}