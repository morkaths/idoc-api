import { config } from '@libs/config';

export const API_CONFIG = {
  timeout: config.services.timeout,
  key: config.auth.apiKey,
  baseURL: config.services.catalog.url,
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