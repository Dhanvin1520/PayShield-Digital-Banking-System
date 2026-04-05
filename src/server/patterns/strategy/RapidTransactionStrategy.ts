import { IFraudStrategy, FraudResult } from '../../interfaces/IFraudRule';
import { ITransaction } from '../../interfaces/ITransaction';
import { IAccount } from '../../interfaces/IAccount';
import Transaction from '../../models/Transaction';

/**
 * RapidTransactionStrategy — Strategy Pattern (Concrete Strategy)
 * 
 * Flags accounts that perform too many transactions in a short time window.
 * Rapid successive transactions can indicate compromised credentials.
 * 
 * Rule: Flag if more than 3 transactions from the same account within 1 minute
 */
class RapidTransactionStrategy implements IFraudStrategy {
  private readonly timeWindowMs: number;
  private readonly maxTransactions: number;

  constructor(timeWindowMs: number = 60000, maxTransactions: number = 3) {
    this.timeWindowMs = timeWindowMs;
    this.maxTransactions = maxTransactions;
  }

  async analyze(transaction: ITransaction, account: IAccount): Promise<FraudResult> {
    const windowStart = new Date(Date.now() - this.timeWindowMs);

    // Count recent transactions from the same account
    const recentCount = await Transaction.countDocuments({
      fromAccount: transaction.fromAccount,
      timestamp: { $gte: windowStart },
    });

    if (recentCount >= this.maxTransactions) {
      return {
        flagged: true,
        reason: `${recentCount + 1} transactions in ${this.timeWindowMs / 1000} seconds (max: ${this.maxTransactions})`,
        severity: 'high',
        ruleName: 'RapidTransactionStrategy',
      };
    }

    return {
      flagged: false,
      ruleName: 'RapidTransactionStrategy',
    };
  }
}

export default RapidTransactionStrategy;
