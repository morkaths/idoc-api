import ApiClient from 'src/config/axios.config';
import type { User } from 'src/types/auth.types';
import { API_CONFIG } from 'src/config/api.config';

export const UserClient = {
  getAll: async (): Promise<User[]> => {
    const response = await ApiClient.get<User[]>(
      API_CONFIG.endpoints.user.getAll,
      { mode: 'public' }
    );
    if (response.success && response.data) {
      return response.data;
    }
    return [];
  },

  getById: async (id: string): Promise<User | null> => {
    const response = await ApiClient.get<User>(
      API_CONFIG.endpoints.user.getById(id),
      { mode: 'public' }
    );
    if (response.success && response.data) {
      return response.data;
    }
    return null;
  },
};