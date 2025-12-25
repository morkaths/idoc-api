import ApiClient from 'src/config/axios.config';
import type { User, Role } from 'src/types/auth.types';
import { API_CONFIG } from 'src/config/api.config';

export const AuthClient = {

  verify: async (token: string): Promise<User | null> => {
    ApiClient.setToken(token);
    const response = await ApiClient.get<User>(API_CONFIG.endpoints.auth.verify);
    if (response.success && response.user) {
      return response.user;
    }
    return null;
  },

  verifyRole: async (roleId: string, roleName: string): Promise<boolean> => {
    const response = await ApiClient.get<Role>(
      API_CONFIG.endpoints.auth.verifyRole(roleId)
    );
    if (response.success && response.data) {
      return response.data.name.toLowerCase() === roleName.toLowerCase();
    }
    return false;
  }

}