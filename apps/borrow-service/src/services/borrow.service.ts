import createHttpError from "http-errors";
import { BaseService } from "@libs/core";
import type { Borrow } from "../models/borrow.model";
import type { BorrowDto } from "../dtos/borrow.dto";
import type { Category, Pagination } from "../types";
import { BorrowMapper } from "../mappers/borrow.mapper";
import { borrowRepository } from "../repositories/borrow.repository";
import { UserClient } from "../integrations/user.client";
import { BookClient } from "../integrations/book.client";
import { publishBorrowEvent, publishReturnEvent } from "../utils/event-publisher.util";

class BorrowService extends BaseService<Borrow, BorrowDto> {
  constructor() {
    super(borrowRepository, BorrowMapper);
  }

  async findList(page: number, limit: number, filter: { [key: string]: any }): Promise<{ data: BorrowDto[]; pagination: Pagination }> {
    const result = await borrowRepository.findList(page, limit, filter);
    const borrows = result.items || [];
    const userIds = [...new Set(borrows.map(b => b.userId).filter((id): id is string => !!id))];
    const itemIds = [...new Set(borrows.map(b => b.itemId).filter((id): id is string => !!id))];
    const users = await UserClient.findByIds(userIds);
    const items = await BookClient.findByIds(itemIds);
    const userMap = new Map(users.map(u => [String(u.id), u]));
    const itemMap = new Map(items.map(b => [String(b._id), b]));
    const data = borrows.map((borrow: Partial<Borrow>) => {
      const user = userMap.get(borrow.userId || '');
      const item = itemMap.get(borrow.itemId || '');
      const dto = this.mapper.toDto(borrow);
      dto.borrower = user;
      dto.item = item;
      return dto;
    });
    return { data, pagination: result.pagination };
  }

  async create(dto: BorrowDto): Promise<BorrowDto> {
    const created = await super.create(dto);
    let categoryIds: string[] = [];
    if (created.itemId) {
      try {
        const book = await BookClient.findById(created.itemId);
        if (book && book.categories) {
          categoryIds = book.categories.map((category: Category) => category._id);
        }
      } catch (error) {
        console.error('Failed to fetch book details for category statistics:', error);
      }
    }
    await publishBorrowEvent(created, categoryIds);
    return created;
  }

  async extendBorrow(borrowId: string, userId: string, isPrivileged: boolean, extraDays: number, note?: string): Promise<BorrowDto> {
    const borrow = await borrowRepository.findById(borrowId);
    if (!borrow) throw new createHttpError.NotFound('Borrow record not found');
    if (!isPrivileged && borrow.userId !== userId) throw new createHttpError.Forbidden('You do not have permission to extend this borrow record');
    if (borrow.status !== 'active') throw new createHttpError.BadRequest('Cannot extend this borrow record');

    const oldExpireTime = borrow.expireTime;
    const newExpireTime = new Date(oldExpireTime.getTime() + extraDays * 24 * 60 * 60 * 1000);

    const updateData = {
      expireTime: newExpireTime,
      $push: {
        renewals: {
          renewedAt: new Date(),
          oldExpireTime: oldExpireTime,
          newExpireTime: newExpireTime
        }
      },
      ...(note && { note })
    };
    const updated = await borrowRepository.update(borrowId, updateData);
    if (!updated) throw new createHttpError.BadRequest('Failed to extend borrow record');
    return this.mapper.toDto(updated);
  }

  async returnItem(borrowId: string, userId: string): Promise<BorrowDto> {
    const borrow = await borrowRepository.findById(borrowId);
    console.log('Returning borrowId:', borrowId, 'by userId:', userId, 'borrow:', borrow);
    if (!borrow) throw new createHttpError.NotFound('Borrow record not found');
    if (borrow.userId !== userId) throw new createHttpError.Forbidden('You do not have permission to return this borrow record');
    if (borrow.status !== 'active') throw new createHttpError.BadRequest('Cannot return this borrow record');
    const updateData = {
      status: 'returned',
      returnTime: new Date(),
    };
    const updated = await borrowRepository.update(borrowId, updateData);
    if (!updated) throw new createHttpError.BadRequest('Failed to return borrow record');

    // Publish to Redis
    const dto = this.mapper.toDto(updated);
    await publishReturnEvent(dto);

    return dto;
  }

  async markOverdueBorrows(): Promise<number> {
    const now = new Date();
    const result = await borrowRepository.updateMany(
      { status: 'active', expireTime: { $lt: now } },
      { status: 'overdue' }
    );
    return result;
  }

  async getBorrowsNeedingBookReminder(): Promise<Array<{ email: string; title: string; coverUrl?: string; expireTime: Date }>> {
    const now = new Date();
    const oneDayLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const borrows = await borrowRepository.find({
      status: 'active',
      expireTime: { $gte: now, $lte: oneDayLater }
    });

    const userIds = [...new Set(borrows.map(b => b.userId).filter(Boolean))];
    const itemIds = [...new Set(borrows.map(b => b.itemId).filter(Boolean))];
    const users = await UserClient.findByIds(userIds);
    const books = await BookClient.findByIds(itemIds);
    const userMap = new Map(users.map(u => [String(u.id), u]));
    const bookMap = new Map(books.map(b => [String(b._id), b]));

    const results = borrows.map((b: Borrow) => {
      const user = userMap.get(String(b.userId));
      const book = bookMap.get(String(b.itemId));
      return {
        email: user?.email || '',
        title: book?.title || '',
        coverUrl: book?.coverUrl || '',
        expireTime: b.expireTime
      };
    }).filter(item => item.email !== '');

    return results;
  }
}

export default new BorrowService();