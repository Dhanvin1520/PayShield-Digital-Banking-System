import Account from '../../models/Account';
import { IAccount, AccountType, AccountStatus } from '../../interfaces/IAccount';
import mongoose from 'mongoose';


class AccountFactory {
   /**
    * 
    * @param type 
    * @param userId
    * @returns 
    */
   public static async createAccount(
      type: AccountType,
      userId: string
   ): Promise<IAccount> {
      const count = await Account.countDocuments();
      const accountNumber = `PAY${String(count + 1001).padStart(7, '0')}`;

      switch (type) {
         case AccountType.SAVINGS:
            return AccountFactory.createSavingsAccount(accountNumber, userId);

         case AccountType.CHECKING:
            return AccountFactory.createCheckingAccount(accountNumber, userId);

         default:
            throw new Error(`Unknown account type: ${type}`);
      }
   }


   private static async createSavingsAccount(
      accountNumber: string,
      userId: string
   ): Promise<IAccount> {
      const account = new Account({
         accountNumber,
         userId: new mongoose.Types.ObjectId(userId),
         type: AccountType.SAVINGS,
         balance: 0,
         status: AccountStatus.ACTIVE,
         interestRate: 0.04, 
         overdraftLimit: null,
      });

      await account.save();
      console.log(`🏦 Savings account ${accountNumber} created for user ${userId}`);
      return account;
   }


   private static async createCheckingAccount(
      accountNumber: string,
      userId: string
   ): Promise<IAccount> {
      const account = new Account({
         accountNumber,
         userId: new mongoose.Types.ObjectId(userId),
         type: AccountType.CHECKING,
         balance: 0,
         status: AccountStatus.ACTIVE,
         interestRate: null,
         overdraftLimit: 5000, 
      });

      await account.save();
      console.log(`🏦 Checking account ${accountNumber} created for user ${userId}`);
      return account;
   }
}

export default AccountFactory;
