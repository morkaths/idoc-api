import * as ENV from './env.config';

export const API_CONFIG = {
  timeout: 10000,
  key: ENV.API_KEY,
  baseURL: ENV.API_URL,
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