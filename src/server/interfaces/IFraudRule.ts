import { ITransaction } from './ITransaction';
import { IAccount } from './IAccount';

/**
 * IFraudRule Interface
 * Defines the Strategy pattern contract for fraud detection rules
 * Demonstrates Open/Closed Principle — new strategies can be added without modifying existing code
 */
export interface FraudResult {
  flagged: boolean;
  reason?: string;
  severity?: 'low' | 'medium' | 'high';
  ruleName: string;
}

export interface IFraudStrategy {
  /**
   * Analyze a transaction for suspicious activity
   * @param transaction - The transaction to analyze
   * @param account - The source account
   * @returns FraudResult indicating if the transaction is suspicious
   */
  analyze(transaction: ITransaction, account: IAccount): Promise<FraudResult>;
}

export interface IFraudAlert {
  transactionId: string;
  userId: string;
  ruleTriggered: string;
  severity: 'low' | 'medium' | 'high';
  status: 'open' | 'investigating' | 'resolved';
  description: string;
  detectedAt: Date;
  resolvedAt?: Date;
}
