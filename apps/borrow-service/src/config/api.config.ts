import { config } from '@libs/config';

export const API_CONFIG = {
  timeout: config.services.timeout,
  key: config.auth.apiKey,
  baseURL: config.services.catalog.url,
  endpoints: {
    auth: {
      verify: '/auth/verify',
    },
    user: {
      find: '/users',
      findById: (id: string) => `/users/${id}`,
      findByIds: '/users/batch',
      search: '/users/search',
      create: '/users',
      update: (id: string) => `/users/${id}`,
      delete: (id: string) => `/users/${id}`,
    },
    book: {
      find: '/books',
      findById: (id: string) => `/books/${id}`,
      findByIds: '/books/batch',
      search: '/books/search',
      create: '/books',
      update: (id: string) => `/books/${id}`,
      delete: (id: string) => `/books/${id}`,
    },
  }
}