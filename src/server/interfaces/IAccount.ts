import { Document } from 'mongoose';


export enum AccountType {
  SAVINGS = 'savings',
  CHECKING = 'checking',
}

export enum AccountStatus {
  ACTIVE = 'active',
  FROZEN = 'frozen',
  CLOSED = 'closed',
}

export interface IAccount extends Document {
  accountNumber: string;
  userId: string;
  type: AccountType;
  balance: number;
  status: AccountStatus;
  interestRate?: number;    
  overdraftLimit?: number; 
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateAccountInput {
  userId: string;
  type: AccountType;
}

export interface IAccountInfo {
  accountNumber: string;
  type: AccountType;
  balance: number;
  status: AccountStatus;
}
