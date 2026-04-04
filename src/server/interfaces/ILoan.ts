import { Document } from 'mongoose';

/**
 * ILoan Interface
 * Defines the contract for Loan entities
 */
export enum LoanPurpose {
  PERSONAL = 'personal',
  HOME = 'home',
  EDUCATION = 'education',
  BUSINESS = 'business',
}

export enum LoanStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface ILoan extends Document {
  userId: string;
  amount: number;
  purpose: LoanPurpose;
  status: LoanStatus;
  interestRate: number;
  termMonths: number;
  monthlyPayment: number;
  appliedAt: Date;
  approvedAt?: Date;
}

export interface ILoanApplicationInput {
  amount: number;
  purpose: LoanPurpose;
  termMonths: number;
}
