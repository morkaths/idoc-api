import { BaseService } from '@libs/core';
import { ReviewDto } from '../dtos/review.dto';
import { IReview } from '../models/review.model';
import { reviewRepository } from '../repositories/review.repository';
import { ReviewMapper } from '../mappers/review.mapper';
import { Pagination } from '../types';

class ReviewService extends BaseService<IReview, ReviewDto> {
    constructor() {
        super(reviewRepository, ReviewMapper);
    }

    async findList(page: number, limit: number, filter: { [key: string]: any }): Promise<{ data: ReviewDto[]; pagination: Pagination }> {
        const result = await reviewRepository.findList(page, limit, filter);
        const data = (result.items || []).map((d: any) => this.mapper.toDto(d));
        return { data, pagination: result.pagination };
    }
}

export const reviewService = new ReviewService();
