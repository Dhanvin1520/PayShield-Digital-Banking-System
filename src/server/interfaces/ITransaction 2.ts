import { Document } from 'mongoose';


export enum TransactionType {
  TRANSFER = 'transfer',
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  FLAGGED = 'flagged',
}

export interface ITransaction extends Document {
  fromAccount: string;
  toAccount: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  flagged: boolean;
  description?: string;
  timestamp: Date;
}

export interface ITransferInput {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  description?: string;
}
