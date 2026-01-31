import { BaseService } from '@libs/core';
import { CollectionDto } from '../dtos/collection.dto';
import { ICollection } from '../models/collection.model';
import { collectionRepository } from '../repositories/collection.repository';
import { CollectionMapper } from '../mappers/collection.mapper';
import { Pagination } from '../types';

class CollectionService extends BaseService<ICollection, CollectionDto> {
    constructor() {
        super(collectionRepository, CollectionMapper);
    }

    async findList(page: number, limit: number, filter: { [key: string]: any }): Promise<{ data: CollectionDto[]; pagination: Pagination }> {
        const result = await collectionRepository.findList(page, limit, filter);
        const data = (result.items || []).map((d: any) => this.mapper.toDto(d));
        return { data, pagination: result.pagination };
    }
}

export const collectionService = new CollectionService();
