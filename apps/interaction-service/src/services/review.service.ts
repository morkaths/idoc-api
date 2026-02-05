import { BaseService } from '@libs/core';
import { ReviewDto } from '../dtos/review.dto';
import { IReview } from '../models/review.model';
import { reviewRepository } from '../repositories/review.repository';
import { ReviewMapper } from '../mappers/review.mapper';
import { Pagination } from '../types';

import { BookClient } from '../integrations/book.client';
import { UserClient } from '../integrations/user.client';

class ReviewService extends BaseService<IReview, ReviewDto> {
    constructor() {
        super(reviewRepository, ReviewMapper);
    }

    async findList(page: number, limit: number, filter: { [key: string]: any }): Promise<{ data: ReviewDto[]; pagination: Pagination }> {
        const result = await reviewRepository.findList(page, limit, filter);
        const reviews = result.items || [];

        // 1. Extract unique User IDs
        const userIds = [...new Set(reviews.map((r: any) => r.userId).filter(Boolean))];

        // 2. Fetch User Details
        const users = await UserClient.findByIds(userIds);
        const userMap = new Map(users.map(u => [u.id, u]));

        // 3. Map Users to Reviews
        const data = reviews.map((d: any) => {
            const dto = this.mapper.toDto(d);
            if (dto.userId) {
                dto.user = userMap.get(dto.userId);
            }
            return dto;
        });

        return { data, pagination: result.pagination };
    }

    private async updateBookRating(bookId: string): Promise<void> {
        try {
            const { averageRating, totalReviews } = await reviewRepository.calculateAverageRating(bookId);
            await BookClient.updateRating(bookId, averageRating, totalReviews);
        } catch (error) {
            console.error(`Failed to update rating for book ${bookId}`, error);
        }
    }

    async create(dto: ReviewDto): Promise<ReviewDto> {
        const result = await super.create(dto);
        this.updateBookRating(result.itemId).catch(err => console.error(err));
        return result;
    }

    async update(id: string, dto: Partial<ReviewDto>): Promise<ReviewDto | null> {
        const result = await super.update(id, dto);
        if (result) {
            this.updateBookRating(result.itemId).catch(err => console.error(err));
        }
        return result;
    }

    async delete(id: string): Promise<boolean> {
        const review = await this.findById(id);
        const result = await super.delete(id);
        if (result && review) {
            this.updateBookRating(review.itemId).catch(err => console.error(err));
        }
        return result;
    }
}

export const reviewService = new ReviewService();
