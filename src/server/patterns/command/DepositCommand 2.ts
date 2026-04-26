import { ICommand } from './ICommand';
import Account from '../../models/Account';

/**
 * DepositCommand — Command Pattern (Concrete Command)
 * 
 * Encapsulates a deposit operation as a command object.
 * Supports execute() to perform the deposit and undo() to reverse it.
 */
class DepositCommand implements ICommand {
   private accountId: string;
   private amount: number;
   private executed: boolean = false;

   constructor(accountId: string, amount: number) {
      this.accountId = accountId;
      this.amount = amount;
   }

   async execute(): Promise<void> {
      if (this.executed) throw new Error('Command already executed');

      const account = await Account.findById(this.accountId);
      if (!account) throw new Error('Account not found');

      account.balance += this.amount;
      await account.save();

      this.executed = true;
      console.log(`💰 Deposit executed: ₹${this.amount} to ${this.accountId}`);
   }

   async undo(): Promise<void> {
      if (!this.executed) throw new Error('Cannot undo — command not yet executed');

      const account = await Account.findById(this.accountId);
      if (!account) throw new Error('Account not found');

      account.balance -= this.amount;
      await account.save();

      this.executed = false;
      console.log(`↩️ Deposit undone: ₹${this.amount} removed from ${this.accountId}`);
   }

   getDescription(): string {
      return `Deposit ₹${this.amount} to ${this.accountId}`;
   }
}

export default DepositCommand;
