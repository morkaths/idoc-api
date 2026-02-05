import { config } from '@libs/config';

export const API_CONFIG = {
  timeout: config.services.timeout,
  key: config.auth.apiKey,
  baseURL: config.app.url,
  endpoints: {
    auth: {
      verify: '/auth/verify',
      verifyRole: (id: string) => `/auth/roles/${id}`,
    },
    user: {
      findAll: '/users',
      findByIds: '/users/batch',
      findById: (id: string) => `/users/${id}`,
      search: '/users/search',
      create: '/users',
      update: (id: string) => `/users/${id}`,
      delete: (id: string) => `/users/${id}`,
    },
    book: {
      updateRating: (id: string) => `/books/${id}/rating`,
    }
  }
}