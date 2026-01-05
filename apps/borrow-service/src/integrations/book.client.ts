import ApiClient from 'src/config/axios.config';
import type { Book, FindParams } from 'src/types';
import { API_CONFIG } from 'src/config/api.config';

export const BookClient = {
  find: async (params?: FindParams): Promise<Book[]> => {
    const response = await ApiClient.get<Book[]>(
      API_CONFIG.endpoints.book.find,
      { mode: 'public', params }
    );
    if (response.success && response.data) {
      return response.data;
    }
    return [];
  },

  findById: async (id: string): Promise<Book | null> => {
    const response = await ApiClient.get<Book>(
      API_CONFIG.endpoints.book.findById(id),
      { mode: 'public' }
    );
    if (response.success && response.data) {
      return response.data;
    }
    return null;
  },

  findByIds: async (ids: string[]): Promise<Book[]> => {
    const response = await ApiClient.post<Book[]>(
      API_CONFIG.endpoints.book.findByIds,
      { mode: 'public', data: { ids } }
    );
    if (response.success && response.data) {
      return response.data;
    }
    return [];
  }

};