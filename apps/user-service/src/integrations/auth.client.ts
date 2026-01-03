import ApiClient from 'src/config/axios.config';
import type { User } from 'src/types';
import { API_CONFIG } from 'src/config/api.config';

export const AuthClient = {
  verify: async (token: string): Promise<User | null> => {
    ApiClient.setToken(token);
    const response = await ApiClient.get<User>(API_CONFIG.endpoints.auth.verify);
    if (response.success && response.data) {
      return response.data;
    }
    return null;
  }
}