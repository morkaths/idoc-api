import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ICopy extends Document {
  documentId: Types.ObjectId;
  type: 'physical' | 'digital';
  barcode?: string | null;
  location?: string;
  condition?: string;
  status: 'available' | 'loaned' | 'lost' | 'maintenance';
  currentLoanId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const CopySchema = new Schema<ICopy>(
  {
    documentId: { type: Schema.Types.ObjectId, required: true, index: true },
    type: { type: String, enum: ['physical', 'digital'], required: true, default: 'physical' },
    barcode: {
      type: String,
      trim: true,
      maxlength: 100,
      index: true,
      unique: true,
      sparse: true,
      required: function (this: ICopy) {
        return this.type === 'physical';
      },
      default: null,
    },
    location: { type: String, trim: true, maxlength: 255 },
    condition: { type: String, trim: true, maxlength: 255 },
    status: {
      type: String,
      enum: ['available', 'loaned', 'lost', 'maintenance'],
      default: 'available',
      index: true,
    },
    currentLoanId: {
      type: String,
      ref: 'Loan',
      index: true,
      required: false,
    },
  },
  { timestamps: true }
);

export const Copy = mongoose.model<ICopy>('Copy', CopySchema);