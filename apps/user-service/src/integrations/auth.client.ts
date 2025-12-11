import ApiClient from 'src/config/axios.config';
import type { User } from 'src/types/auth.types';
import { API_CONFIG } from 'src/config/api.config';

export const AuthClient = {

  verify: async (token: string): Promise<User | null> => {
    const response = await ApiClient.get<User>(
      API_CONFIG.endpoints.auth.verify,
      { headers: { Authorization: `Bearer ${token}` }, }
    );
    if (response.success && response.user) {
      return response.user;
    }
    return null
  },


}