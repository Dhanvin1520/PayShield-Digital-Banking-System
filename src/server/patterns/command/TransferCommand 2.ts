import { ICommand } from './ICommand';
import Account from '../../models/Account';

/**
 * TransferCommand — Command Pattern (Concrete Command)
 * 
 * Encapsulates a fund transfer between two accounts as a command object.
 * Supports execute() to perform the transfer and undo() to reverse it.
 */
class TransferCommand implements ICommand {
   private fromAccountId: string;
   private toAccountId: string;
   private amount: number;
   private executed: boolean = false;

   constructor(fromAccountId: string, toAccountId: string, amount: number) {
      this.fromAccountId = fromAccountId;
      this.toAccountId = toAccountId;
      this.amount = amount;
   }


   async execute(): Promise<void> {
      if (this.executed) {
         throw new Error('Command already executed');
      }


      const fromAccount = await Account.findById(this.fromAccountId);
      if (!fromAccount) throw new Error('Source account not found');
      if (fromAccount.balance < this.amount) throw new Error('Insufficient balance');

      const toAccount = await Account.findById(this.toAccountId);
      if (!toAccount) throw new Error('Destination account not found');


      fromAccount.balance -= this.amount;
      toAccount.balance += this.amount;

      await fromAccount.save();
      await toAccount.save();

      this.executed = true;
      console.log(`💸 Transfer executed: ₹${this.amount} from ${this.fromAccountId} to ${this.toAccountId}`);
   }

   async undo(): Promise<void> {
      if (!this.executed) {
         throw new Error('Cannot undo — command not yet executed');
      }

      const fromAccount = await Account.findById(this.fromAccountId);
      const toAccount = await Account.findById(this.toAccountId);

      if (!fromAccount || !toAccount) {
         throw new Error('Accounts not found for undo');
      }

      toAccount.balance -= this.amount;
      fromAccount.balance += this.amount;

      await toAccount.save();
      await fromAccount.save();

      this.executed = false;
      console.log(`↩️ Transfer undone: ₹${this.amount} returned to ${this.fromAccountId}`);
   }

   getDescription(): string {
      return `Transfer ₹${this.amount} from ${this.fromAccountId} to ${this.toAccountId}`;
   }
}

export default TransferCommand;
