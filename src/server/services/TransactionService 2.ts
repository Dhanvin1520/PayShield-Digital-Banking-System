import Transaction from '../models/Transaction';
import Account from '../models/Account';
import { ITransaction, TransactionType, TransactionStatus } from '../interfaces/ITransaction';
import FraudDetectionEngine from '../fraud/FraudDetectionEngine';
import CommandInvoker from '../patterns/command/CommandInvoker';
import TransferCommand from '../patterns/command/TransferCommand';
import HighValueStrategy from '../patterns/strategy/HighValueStrategy';
import RapidTransactionStrategy from '../patterns/strategy/RapidTransactionStrategy';
import NewRecipientStrategy from '../patterns/strategy/NewRecipientStrategy';


class TransactionService {
  private fraudEngine: FraudDetectionEngine;
  private commandInvoker: CommandInvoker;

  constructor() {

    this.fraudEngine = new FraudDetectionEngine();
    this.fraudEngine.addStrategy(new HighValueStrategy(50000));       
    this.fraudEngine.addStrategy(new RapidTransactionStrategy(60000, 3)); 
    this.fraudEngine.addStrategy(new NewRecipientStrategy());         
    this.commandInvoker = new CommandInvoker();
  }


  async transfer(
    fromAccountId: string,
    toAccountId: string,
    amount: number,
    description?: string
  ): Promise<ITransaction> {
    const fromAccount = await Account.findById(fromAccountId);
    if (!fromAccount) throw Object.assign(new Error('Source account not found'), { statusCode: 404 });

    const toAccount = await Account.findById(toAccountId);
    if (!toAccount) throw Object.assign(new Error('Destination account not found'), { statusCode: 404 });

    if (fromAccount.balance < amount) {
      throw Object.assign(new Error('Insufficient balance'), { statusCode: 400 });
    }


    const transaction = new Transaction({
      fromAccount: fromAccountId,
      toAccount: toAccountId,
      amount,
      type: TransactionType.TRANSFER,
      status: TransactionStatus.PENDING,
      description,
    });


    const isSuspicious = await this.fraudEngine.isTransactionSuspicious(
      transaction,
      fromAccount
    );

    if (isSuspicious) {
      transaction.flagged = true;
      transaction.status = TransactionStatus.FLAGGED;
      await transaction.save();
      return transaction;
    }


    const transferCommand = new TransferCommand(fromAccountId, toAccountId, amount);
    await this.commandInvoker.executeCommand(transferCommand);

    transaction.status = TransactionStatus.COMPLETED;
    await transaction.save();

    return transaction;
  }


  async getTransactionHistory(
    accountId: string,
    limit: number = 50
  ): Promise<ITransaction[]> {
    return Transaction.find({
      $or: [{ fromAccount: accountId }, { toAccount: accountId }],
    })
      .sort({ timestamp: -1 })
      .limit(limit)
      .populate('fromAccount', 'accountNumber type')
      .populate('toAccount', 'accountNumber type');
  }


  async getUserTransactions(userId: string, limit: number = 50): Promise<ITransaction[]> {
    const accounts = await Account.find({ userId });
    const accountIds = accounts.map((a) => a._id);

    return Transaction.find({
      $or: [
        { fromAccount: { $in: accountIds } },
        { toAccount: { $in: accountIds } },
      ],
    })
      .sort({ timestamp: -1 })
      .limit(limit)
      .populate('fromAccount', 'accountNumber type')
      .populate('toAccount', 'accountNumber type');
  }

 
  async getFlaggedTransactions(): Promise<ITransaction[]> {
    return Transaction.find({ flagged: true })
      .sort({ timestamp: -1 })
      .populate('fromAccount', 'accountNumber type')
      .populate('toAccount', 'accountNumber type');
  }
}

export default TransactionService;
