import { BaseRepository } from '@libs/core';
import { Review, IReview } from '../models/review.model';

class ReviewRepository extends BaseRepository<IReview> {
    constructor() {
        super(Review);
    }
    async findList(
        page: number,
        limit: number,
        filter: { [key: string]: any }
    ) {
        const {
            query,
            sortBy = "createdAt",
            sortOrder = "desc",
            ...rest
        } = filter;

        const conditions: any[] = [];

        if (query) {
            const regex = new RegExp(String(query), "i");
            conditions.push({
                $or: [
                    { content: regex }
                ]
            });
        }

        Object.entries(rest).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                conditions.push({ [key]: value });
            }
        });

        const match = conditions.length > 0 ? { $and: conditions } : {};
        const options = {
            page: Number(page),
            limit: Math.max(1, Number(limit)),
            sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 },
            lean: true
        };

        return this.paginate(match, options);
    }
}

export const reviewRepository = new ReviewRepository();
