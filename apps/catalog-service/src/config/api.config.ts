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
      getList: '/users',
      getById: (id: string) => `/users/${id}`,
      search: '/users/search',
      create: '/users',
      update: (id: string) => `/users/${id}`,
      delete: (id: string) => `/users/${id}`,
    },
    bookmark: {
      getList: '/bookmarks',
      getById: (id: string) => `/bookmarks/${id}`,
      search: '/bookmarks/search',
      create: '/bookmarks',
      update: (id: string) => `/bookmarks/${id}`,
      delete: (id: string) => `/bookmarks/${id}`,
    }
  }
}