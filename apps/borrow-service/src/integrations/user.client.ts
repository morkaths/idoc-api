import ApiClient from 'src/config/axios.config';
import type { FindParams, User } from 'src/types';
import { API_CONFIG } from 'src/config/api.config';

export const UserClient = {
  find: async (params?: FindParams): Promise<User[]> => {
    const response = await ApiClient.get<User[]>(
      API_CONFIG.endpoints.user.find,
      { mode: 'public', params }
    );
    if (response.success && response.data) {
      return response.data;
    }
    return [];
  },

  findById: async (id: string): Promise<User | null> => {
    const response = await ApiClient.get<User>(
      API_CONFIG.endpoints.user.findById(id),
      { mode: 'public' }
    );
    if (response.success && response.data) {
      return response.data;
    }
    return null;
  },

  findByIds: async (ids: string[]): Promise<User[]> => {
    const response = await ApiClient.post<User[]>(
      API_CONFIG.endpoints.user.findByIds,
      { mode: 'public', data: { ids } }
    );
    if (response.success && response.data) {
      return response.data;
    }
    return [];
  }
};