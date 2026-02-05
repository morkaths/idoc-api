import ApiClient from '../config/axios.config';
import { API_CONFIG } from '../config/api.config';

export const BookClient = {
    updateRating: async (id: string, rating: number, totalReviews: number): Promise<boolean> => {
        const response = await ApiClient.patch(
            API_CONFIG.endpoints.book.updateRating(id),
            { mode: 'private', data: { rating, totalReviews } }
        );
        return response.success;
    }
};
