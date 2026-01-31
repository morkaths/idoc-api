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
        userId: { type: String, required: true, trim: true },
        itemId: { type: String, required: true, trim: true },
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
        status: { 
            type: String, 
            trim: true, 
            enum: ['active', 'returned', 'overdue', 'cancelled'],
            default: 'active' 
        }
    },
    { timestamps: true }
);

BorrowSchema.index({ userId: 1, status: 1 });
BorrowSchema.index({ itemId: 1, status: 1 });
BorrowSchema.index({ status: 1 });
BorrowSchema.index({ expireTime: 1 }, { partialFilterExpression: { status: 'active' } });

export const Borrow = model<Borrow>('Borrow', BorrowSchema);