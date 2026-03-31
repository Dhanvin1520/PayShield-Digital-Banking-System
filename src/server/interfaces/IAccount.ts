import { Document } from 'mongoose';

/**
 * IAccount Interface
 * Defines the contract for Account entities
 * Base interface supports Liskov Substitution — SavingsAccount and CheckingAccount
 */
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
  interestRate?: number;    // For savings accounts
  overdraftLimit?: number;  // For checking accounts
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
