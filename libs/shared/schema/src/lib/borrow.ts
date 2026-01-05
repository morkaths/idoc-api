import { z } from 'zod';
import { dateOrString } from './common';
import { UserSchema } from './auth';
import { BookSchema } from './document';

// ═══════════════════════════════════════════════════════════════════════════════
// BORROW TYPES: Xử lý mượn sách
// ═══════════════════════════════════════════════════════════════════════════════
export const BorrowSchema = z.object({
    _id: z.string(),
    userId: z.string(),
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
    note: z.string().optional(),
    status: z.string(),
    createdAt: dateOrString,
    updatedAt: dateOrString,
});

export type Borrow = z.infer<typeof BorrowSchema>;
