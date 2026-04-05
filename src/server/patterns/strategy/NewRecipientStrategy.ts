import { IFraudStrategy, FraudResult } from '../../interfaces/IFraudRule';
import { ITransaction } from '../../interfaces/ITransaction';
import { IAccount } from '../../interfaces/IAccount';
import Transaction from '../../models/Transaction';

/**
 * NewRecipientStrategy — Strategy Pattern (Concrete Strategy)
 * 
 * Flags transactions sent to recipients that the sender has never
 * transacted with before. First-time transfers to unknown accounts
 * are a common indicator of social engineering or phishing attacks.
 * 
 * Rule: Flag if the sender has never sent money to this recipient before
 */
class NewRecipientStrategy implements IFraudStrategy {
  async analyze(transaction: ITransaction, account: IAccount): Promise<FraudResult> {
    // Check if the sender has ever sent money to this recipient
    const previousTransactions = await Transaction.countDocuments({
      fromAccount: transaction.fromAccount,
      toAccount: transaction.toAccount,
    });

    if (previousTransactions === 0) {
      return {
        flagged: true,
        reason: 'First-time transfer to a new recipient',
        severity: 'low',
        ruleName: 'NewRecipientStrategy',
      };
    }

    return {
      flagged: false,
      ruleName: 'NewRecipientStrategy',
    };
  }
}

export default NewRecipientStrategy;
