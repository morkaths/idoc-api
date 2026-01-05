import { Schema, model, Document } from 'mongoose';

export interface Borrow extends Document {
    userId: string;
    itemId: string;
    renewals: {
        renewedAt: Date;
        oldExpireTime: Date;
        newExpireTime: Date;
    }[];
    borrowTime: Date;
    expireTime: Date;
    returnTime?: Date;
    note?: string;
    status: string; // active, returned, overdue
    createdAt?: Date;
    updatedAt?: Date;
}

const BorrowSchema = new Schema<Borrow>(
    {
        userId: { type: String, required: true },
        itemId: { type: String, required: true },
        renewals: [{
            renewedAt: { type: Date, default: Date.now },
            oldExpireTime: { type: Date, required: true },
            newExpireTime: { type: Date, required: true }
        }],
        borrowTime: { type: Date, required: true, default: Date.now },
        expireTime: {
            type: Date,
            required: true,
            validate: {
                validator: function (value: Date) {
                    return value instanceof Date && !isNaN(value.getTime()) && value > new Date();
                },
                message: 'expireTime must be a valid future date'
            }
        },
        returnTime: {
            type: Date,
            validate: {
                validator: function (value: Date) {
                    return value == null || (value instanceof Date && !isNaN(value.getTime()));
                },
                message: 'returnTime must be a valid date'
            }
        },
        note: { type: String, trim: true },
        status: { type: String, trim: true, default: 'active' }
    },
    { timestamps: true }
);

export const Borrow = model<Borrow>('Borrow', BorrowSchema);