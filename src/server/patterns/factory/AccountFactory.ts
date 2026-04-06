import Account from '../../models/Account';
import { IAccount, AccountType, AccountStatus } from '../../interfaces/IAccount';
import mongoose from 'mongoose';

/**
 * AccountFactory — Factory Pattern
 * 
 * Creates different types of bank accounts (Savings, Checking)
 * with their specific configurations without exposing creation logic.
 * 
 * Design Pattern: Factory (Creational)
 * SOLID: Open/Closed Principle — new account types can be added
 * OOP: Abstraction — creation details hidden from callers
 */
class AccountFactory {
   /**
    * Create a new bank account based on the specified type
    * Factory method that encapsulates account creation logic
    * 
    * @param type - Type of account to create (savings or checking)
    * @param userId - Owner of the account
    * @returns Created account document
    */
   public static async createAccount(
      type: AccountType,
      userId: string
   ): Promise<IAccount> {
      // Generate unique account number
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

   /**
    * Create a Savings Account
    * Savings accounts have interest rates but no overdraft
    */
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
         interestRate: 0.04, // 4% annual interest
         overdraftLimit: null,
      });

      await account.save();
      console.log(`🏦 Savings account ${accountNumber} created for user ${userId}`);
      return account;
   }

   /**
    * Create a Checking Account
    * Checking accounts have overdraft limits but no interest
    */
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
         overdraftLimit: 5000, // ₹5,000 overdraft limit
      });

      await account.save();
      console.log(`🏦 Checking account ${accountNumber} created for user ${userId}`);
      return account;
   }
}

export default AccountFactory;
