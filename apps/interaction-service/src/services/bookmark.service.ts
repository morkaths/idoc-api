import { BaseService } from '@libs/core';
import { BookmarkDto } from '../dtos/bookmark.dto';
import { IBookmark } from '../models/bookmark.model';
import { bookmarkRepository } from '../repositories/bookmark.repository';
import { bookmarkMapper } from '../mappers/bookmark.mapper';
import { Pagination } from '../types';

import { collectionRepository } from '../repositories/collection.repository';

class BookmarkService extends BaseService<IBookmark, BookmarkDto> {
    constructor() {
        super(bookmarkRepository, bookmarkMapper);
    }

    async findList(page: number, limit: number, filter: { [key: string]: any }): Promise<{ data: BookmarkDto[]; pagination: Pagination }> {
        const result = await bookmarkRepository.findList(page, limit, filter);
        const data = (result.items || []).map((d: any) => this.mapper.toDto(d));
        return { data, pagination: result.pagination };
    }

    async findByItemIds(userId: string, itemIds: string[]): Promise<Record<string, string | null>> {
        const bookmarks = await bookmarkRepository.find({
            userId,
            itemId: { $in: itemIds }
        });
        const bookmarkMap = new Map();
        bookmarks.forEach((b: any) => bookmarkMap.set(b.itemId.toString(), b._id.toString()));
        const result: Record<string, string | null> = {};
        itemIds.forEach(id => {
            result[id] = bookmarkMap.get(id) || null;
        });
        return result;
    }

    async create(dto: Partial<BookmarkDto>): Promise<BookmarkDto> {
        const result = await super.create(dto);
        if (dto.collectionId) {
            await collectionRepository.update(dto.collectionId, { $inc: { itemCount: 1 } } as any);
        }
        return result;
    }

    async delete(id: string): Promise<boolean> {
        const deletedBookmark = await this.repository.findOneAndDelete({ _id: id });
        if (deletedBookmark) {
            if (deletedBookmark.collectionId) {
                await collectionRepository.update(deletedBookmark.collectionId.toString(), { $inc: { itemCount: -1 } } as any);
            }
            return true;
        }
        return false;
    }

}

export const bookmarkService = new BookmarkService();
