import { createClassTransformerMapper } from '@libs/core';
import { ReviewDto } from '../dtos/review.dto';
import { IReview } from '../models/review.model';

export const ReviewMapper = createClassTransformerMapper<IReview, ReviewDto>(ReviewDto);
