import BorrowService from '../services/borrow.service';
import { asyncHandler } from '../middleware/error.middleware';
import { AuthRequest } from '../types';
import * as response from '../utils/response.util';
import { RoleEnum } from 'src/constants/security/role';
import { BookClient } from 'src/integrations/book.client';

const BorrowController = {
  getList: asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, ...filters } = req.query;
    const { data, pagination } = await BorrowService.findList(
      Number(page),
      Number(limit),
      filters
    );
    if (!data || data.length === 0) {
      return response.notFound(res, 'No borrow records found');
    }
    response.paginated(res, 'Get borrow records successfully', data, pagination);
  }),

  getHistory: asyncHandler<AuthRequest>(async (req, res) => {
    const { page = 1, limit = 10, ...filters } = req.query;
    const { data, pagination } = await BorrowService.findList(
      Number(page),
      Number(limit),
      { userId: req.user.id, ...filters }
    );
    response.paginated(res, "Get borrow history successfully", data, pagination);
  }),

  getByIds: asyncHandler(async (req, res) => {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return response.badRequest(res, 'List of IDs must not be empty');
    }
    const borrows = await BorrowService.findByIds(ids);
    if (!borrows || borrows.length === 0) {
      return response.notFound(res, 'No borrow records found for the provided IDs');
    }
    response.success(res, 'Get borrow records successfully', borrows);
  }),

  getById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const borrow = await BorrowService.findById(id);
    if (!borrow) {
      return response.notFound(res, 'Borrow record not found');
    }
    response.success(res, 'Get borrow record successfully', borrow);
  }),

  create: asyncHandler<AuthRequest>(async (req, res) => {
    const borrowDto = req.body;
    borrowDto.userId = req.user.id;
    const item = await BookClient.findById(borrowDto.itemId);
    if (!item) return response.badRequest(res, 'Item to borrow not found');
    const borrow = await BorrowService.create(borrowDto);
    if (!borrow) return response.badRequest(res, "Failed to create borrow record");
    response.created(res, 'Borrow record created successfully', borrow);
  }),

  update: asyncHandler<AuthRequest>(async (req, res) => {
    const { id } = req.params;
    const borrowDto = req.body;
    const item = await BookClient.findById(borrowDto.itemId);
    if (!item) return response.badRequest(res, 'Item to borrow not found');
    const borrow = await BorrowService.update(id, borrowDto);
    if (!borrow) {
      return response.notFound(res, 'Borrow record not found');
    }
    response.updated(res, 'Borrow record updated successfully', borrow);
  }),

  delete: asyncHandler<AuthRequest>(async (req, res) => {
    const { id } = req.params;
    const result = await BorrowService.delete(id);
    if (!result) {
      return response.notFound(res, 'Borrow record not found');
    }
    response.deleted(res, 'Borrow record deleted successfully');
  }),

  extend: asyncHandler<AuthRequest>(async (req, res) => {
    const { id } = req.params;
    const { extraDays, note } = req.body;
    const privilegedRoles = [RoleEnum.ADMIN, RoleEnum.MANAGER, RoleEnum.STAFF];
    const isPrivileged = req.user.roles?.some((role: string) => privilegedRoles.includes(role as RoleEnum)) ?? false;
    const borrow = await BorrowService.extendBorrow(id, String(req.user.id), isPrivileged, Number(extraDays), note);
    response.updated(res, 'Borrow record extended successfully', borrow);
  }),

  return: asyncHandler<AuthRequest>(async (req, res) => {
    const { id } = req.params;
    const borrow = await BorrowService.returnItem(id, String(req.user.id));
    response.updated(res, 'Book returned successfully', borrow);
  }),
};

export default BorrowController;