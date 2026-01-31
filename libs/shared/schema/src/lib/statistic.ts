import { z } from 'zod';
import { dateOrString } from './common';

// ═══════════════════════════════════════════════════════════════════════════════
// STATISTIC TYPES: Thống kê và báo cáo
// ═══════════════════════════════════════════════════════════════════════════════

export const OverallStatisticSchema = z.object({
    totalBorrows: z.number().int(),
    totalReturns: z.number().int(),
    totalOverdue: z.number().int(),
});

export const DailyStatisticSchema = z.object({
    date: dateOrString,
    totalBorrows: z.number().int(),
    totalReturns: z.number().int(),
    totalOverdue: z.number().int(),
});

export const DayOfWeekStatisticSchema = z.object({
    dayOfWeek: z.string(),
    totalBorrows: z.number().int(),
});

export const BookStatisticSchema = z.object({
    bookId: z.string(),
    totalBorrows: z.number().int(),
});

export const CategoryStatisticSchema = z.object({
    categoryId: z.string(),
    totalBorrows: z.number().int(),
});

export const UserStatisticSchema = z.object({
    userId: z.string(),
    totalBorrows: z.number().int(),
    lastActiveDate: dateOrString,
});

export type OverallStatistic = z.infer<typeof OverallStatisticSchema>;
export type DailyStatistic = z.infer<typeof DailyStatisticSchema>;
export type DayOfWeekStatistic = z.infer<typeof DayOfWeekStatisticSchema>;
export type BookStatistic = z.infer<typeof BookStatisticSchema>;
export type CategoryStatistic = z.infer<typeof CategoryStatisticSchema>;
export type UserStatistic = z.infer<typeof UserStatisticSchema>;
