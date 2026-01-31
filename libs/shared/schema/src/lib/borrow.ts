import { z } from 'zod';
import { dateOrString } from './common';
import { UserSchema } from './auth';
import { BookSchema } from './catalog';

// ═══════════════════════════════════════════════════════════════════════════════
// BORROW TYPES: Xử lý mượn sách
// ═══════════════════════════════════════════════════════════════════════════════
export const BorrowSchema = z.object({
    id: z.string(),
    userId: z.string().trim(),
    borrower: UserSchema.optional(),
    itemId: z.string(),
    item: BookSchema.optional(),
    renewals: z.array(z.object({
        renewedAt: dateOrString,
        oldExpireTime: dateOrString,
        newExpireTime: dateOrString
    })),
    borrowTime: dateOrString,
    expireTime: dateOrString,
    returnTime: dateOrString.optional(),
    note: z.string().trim().optional(),
    status: z.enum(['active', 'returned', 'overdue', 'cancelled']),
    createdAt: dateOrString,
    updatedAt: dateOrString,
});

export type Borrow = z.infer<typeof BorrowSchema>;
