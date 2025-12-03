import * as ApiRequest from './index';
import type { User } from 'src/types/auth.types';
import { API_CONFIG } from 'src/config/api.config';

const SERVICE: ApiRequest.ApiService = 'auth';

export const UserClient = {

  getAll: async (): Promise<User[]> => {
    const response = await ApiRequest.apiGet<User[]>( SERVICE, API_CONFIG.endpoints.user.getAll, {
      mode: 'public',
    });
    if (response.success && response.data) {
      return response.data;
    }
    return [];
  },

  getById: async (id: string): Promise<User | null> => {
    const response = await ApiRequest.apiGet<User>( SERVICE, API_CONFIG.endpoints.user.getById(id), {
      mode: 'public',
    });
    if (response.success && response.data) {
      return response.data;
    } 
    return null;
  }, 

}