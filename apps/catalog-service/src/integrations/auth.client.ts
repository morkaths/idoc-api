import * as ApiRequest from './index';
import type { User, Role } from 'src/types/auth.types';
import { API_CONFIG } from 'src/config/api.config';

const SERVICE: ApiRequest.ApiService = 'auth';

export const AuthClient = {

  verifyToken: async (token: string): Promise<User | null> => {
    const response = await ApiRequest.apiGet<User>( SERVICE, API_CONFIG.endpoints.auth.verify, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.success && response.user) {
      return response.user;
    }
    return null;
  },

  verifyRole: async (roleId: string, roleName: string): Promise<boolean> => {
    const response = await ApiRequest.apiGet<Role>( SERVICE, API_CONFIG.endpoints.auth.verifyRole(roleId));
    if (response.success && response.data) {
      return response.data.name.toLowerCase() === roleName.toLowerCase();
    }
    return false;
  }


}