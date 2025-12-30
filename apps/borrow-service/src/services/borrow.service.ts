import createHttpError from "http-errors";
import { BaseService } from "../core/base.service";
import { Borrow } from "../models/borrow.model";
import { BorrowDto } from "../dtos/borrow.dto";
import { BorrowMapper } from "../mappers/borrow.mapper";
import { borrowRepository } from "../repositories/borrow.repository";
import { Pagination } from "../types";
import { UserClient } from "src/integrations/user.client";
import { BookClient } from "src/integrations/book.client";

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
    console.log('userMap:', userMap, 'itemMap:', itemMap);

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

  async extendBorrow(borrowId: string, userId: string, isPrivileged: boolean, extraDays: number, note?: string): Promise<BorrowDto> {
    const borrow = await borrowRepository.findById(borrowId);
    if (!borrow) throw new createHttpError.NotFound('Borrow record not found');
    if (!isPrivileged && borrow.userId !== userId) throw new createHttpError.Forbidden('You do not have permission to extend this borrow record');
    if (borrow.status !== 'active') throw new createHttpError.BadRequest('Cannot extend this borrow record');

    const updateData = {
      expireTime: new Date(borrow.expireTime.getTime() + extraDays * 24 * 60 * 60 * 1000),
      count: borrow.count + 1,
      note,
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
    return this.mapper.toDto(updated);
  }

  async markOverdueBorrows(): Promise<number> {
    const now = new Date();
    const result = await borrowRepository.updateMany(
      { status: 'active', expireTime: { $lt: now } },
      { status: 'overdue' }
    );
    return result;
  }

  async getBorrowsNeedingBookReminder(): Promise<Array<{ email: string; title: string; expireTime: Date }>> {
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
    const userMap = new Map(users.map(u => [u.id, u]));
    const bookMap = new Map(books.map(b => [b._id, b]));

    const results = await Promise.all(
      borrows.map(async (b: Borrow) => {
        const user = userMap.get(b.userId);
        const book = bookMap.get(b.itemId);
        return {
          email: user?.email || '',
          title: book?.title || '',
          expireTime: b.expireTime
        };
      })
    );

    return results;
  }
}

export default new BorrowService();