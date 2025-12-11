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
      getAll: '/users',
      getById: (id: string) => `/users/${id}`,
      search: '/users/search',
      create: '/users',
      update: (id: string) => `/users/${id}`,
      delete: (id: string) => `/users/${id}`,
    }
  }
}