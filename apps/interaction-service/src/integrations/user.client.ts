import ApiClient from '../config/axios.config';
import { API_CONFIG } from '../config/api.config';
import { User } from '@libs/schema';

export const UserClient = {
    findByIds: async (ids: string[]): Promise<User[]> => {
        if (!ids.length) return [];

        const response = await ApiClient.post<User[]>(
            API_CONFIG.endpoints.user.findByIds,
            { mode: 'public', data: { ids } }
        );

        if (response.success && response.data) {
            return response.data.map(u => ({
                ...u,
                id: String(u.id)
            }));
        }
        return [];
    }
};
