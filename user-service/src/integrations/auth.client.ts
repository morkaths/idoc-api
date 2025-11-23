import * as ApiRequest from './index';
import type { User } from 'src/types/auth.types';
import { API_CONFIG } from 'src/config/api.config';

const SERVICE: ApiRequest.ApiService = 'auth';

export const AuthClient = {

  verify: async (token: string): Promise<User | null> => {
    const response = await ApiRequest.apiGet<User>( SERVICE, API_CONFIG.endpoints.auth.verify, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.success && response.user) {
      return response.user;
    }
    return null;
  },


}