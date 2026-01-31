import { BaseRepository } from '@libs/core';
import { Bookmark, IBookmark } from '../models/bookmark.model';

class BookmarkRepository extends BaseRepository<IBookmark> {
    constructor() {
        super(Bookmark);
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

        // Note: Bookmark usually doesn't have text search fields.
        // If needed, we could search itemId or other fields, but for now exact match via ...rest is primary.

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

export const bookmarkRepository = new BookmarkRepository();
