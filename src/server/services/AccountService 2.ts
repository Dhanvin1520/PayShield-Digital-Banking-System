import Account from '../models/Account';
import { IAccount, AccountType } from '../interfaces/IAccount';
import AccountFactory from '../patterns/factory/AccountFactory';


class AccountService {

  async createAccount(userId: string, type: AccountType): Promise<IAccount> {
    return AccountFactory.createAccount(type, userId);
  }

  
  async getAccountsByUserId(userId: string): Promise<IAccount[]> {
    return Account.find({ userId }).sort({ createdAt: -1 });
  }

  async getAccountById(accountId: string): Promise<IAccount | null> {
    return Account.findById(accountId);
  }

  
  async getAccountByNumber(accountNumber: string): Promise<IAccount | null> {
    return Account.findOne({ accountNumber });
  }


  async getTotalBalance(userId: string): Promise<number> {
    const accounts = await Account.find({ userId, status: 'active' });
    return accounts.reduce((total, account) => total + account.balance, 0);
  }
}

export default AccountService;
