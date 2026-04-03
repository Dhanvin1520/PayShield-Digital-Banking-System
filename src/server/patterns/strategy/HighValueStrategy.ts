import { IFraudStrategy, FraudResult } from '../../interfaces/IFraudRule';
import { ITransaction } from '../../interfaces/ITransaction';
import { IAccount } from '../../interfaces/IAccount';

/**
 * HighValueStrategy — Strategy Pattern (Concrete Strategy)
 * 
 * Flags transactions that exceed a monetary threshold.
 * Large, unexpected transactions are a common fraud indicator.
 * 
 * Rule: Flag any single transaction above ₹50,000
 */
class HighValueStrategy implements IFraudStrategy {
  private readonly threshold: number;

  constructor(threshold: number = 50000) {
    this.threshold = threshold;
  }

  async analyze(transaction: ITransaction, account: IAccount): Promise<FraudResult> {
    if (transaction.amount > this.threshold) {
      return {
        flagged: true,
        reason: `Transaction amount ₹${transaction.amount.toLocaleString()} exceeds threshold of ₹${this.threshold.toLocaleString()}`,
        severity: transaction.amount > this.threshold * 2 ? 'high' : 'medium',
        ruleName: 'HighValueStrategy',
      };
    }

    return {
      flagged: false,
      ruleName: 'HighValueStrategy',
    };
  }
}

export default HighValueStrategy;
