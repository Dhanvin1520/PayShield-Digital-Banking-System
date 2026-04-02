import Account from '../models/Account';
import { IAccount, AccountType } from '../interfaces/IAccount';
import AccountFactory from '../patterns/factory/AccountFactory';

/**
 * AccountService — Single Responsibility Principle
 * Handles only account-related business logic.
 * Uses the Factory pattern for account creation.
 */
class AccountService {
  /**
   * Create a new account using the Factory pattern
   * Abstraction: caller doesn't need to know about Savings vs Checking config
   */
  async createAccount(userId: string, type: AccountType): Promise<IAccount> {
    // Factory pattern: AccountFactory decides how to create the account
    return AccountFactory.createAccount(type, userId);
  }

  /**
   * Get all accounts for a user
   */
  async getAccountsByUserId(userId: string): Promise<IAccount[]> {
    return Account.find({ userId }).sort({ createdAt: -1 });
  }

  /**
   * Get a single account by ID
   */
  async getAccountById(accountId: string): Promise<IAccount | null> {
    return Account.findById(accountId);
  }

  /**
   * Get account by account number
   */
  async getAccountByNumber(accountNumber: string): Promise<IAccount | null> {
    return Account.findOne({ accountNumber });
  }

  /**
   * Get total balance across all accounts for a user
   */
  async getTotalBalance(userId: string): Promise<number> {
    const accounts = await Account.find({ userId, status: 'active' });
    return accounts.reduce((total, account) => total + account.balance, 0);
  }
}

export default AccountService;
