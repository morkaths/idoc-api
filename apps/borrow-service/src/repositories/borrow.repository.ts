import { Borrow, Borrow as IBorrow } from "../models/borrow.model";
import { BaseRepository } from "@libs/core";

class BorrowRepository extends BaseRepository<IBorrow> {
    constructor() {
        super(Borrow);
    }

    async findList(
        page: number,
        limit: number,
        filter: { [key: string]: any }
    ) {
        const {
            query,
            sortBy = 'borrowTime',
            sortOrder = 'desc',
            ...rest
        } = filter;
        const conditions: any[] = [];

        if (query) {
            const regex = new RegExp(String(query), "i");
            conditions.push({
                $or: [
                    { userId: regex },
                    { bookId: regex }
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

export const borrowRepository = new BorrowRepository();