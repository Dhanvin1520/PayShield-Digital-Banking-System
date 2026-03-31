import mongoose, { Schema } from 'mongoose';
import { ITransaction, TransactionType, TransactionStatus } from '../interfaces/ITransaction';

/**
 * Transaction Model
 * Represents a financial transaction between accounts
 * Works with the Command pattern for execute/undo operations
 */
const TransactionSchema: Schema = new Schema(
  {
    fromAccount: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: [true, 'Source account is required'],
    },
    toAccount: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: [true, 'Destination account is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [1, 'Amount must be at least ₹1'],
    },
    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: [true, 'Transaction type is required'],
    },
    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      default: TransactionStatus.PENDING,
    },
    flagged: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, 'Description cannot exceed 200 characters'],
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false, // We use our own timestamp field
  }
);

/**
 * Index for efficient queries on transaction history
 */
TransactionSchema.index({ fromAccount: 1, timestamp: -1 });
TransactionSchema.index({ toAccount: 1, timestamp: -1 });
TransactionSchema.index({ flagged: 1 });

const Transaction = mongoose.model<ITransaction>('Transaction', TransactionSchema);
export default Transaction;
