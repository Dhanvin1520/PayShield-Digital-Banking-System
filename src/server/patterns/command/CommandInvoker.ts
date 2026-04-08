import { ICommand } from './ICommand';

/**
 * CommandInvoker — Command Pattern (Invoker)
 * 
 * Manages command execution and maintains a history of executed commands.
 * Supports undoing the last command for transaction reversal.
 * 
 * Design Pattern: Command (Behavioral)
 * Responsibility: Execute commands and maintain undo history
 */
class CommandInvoker {
   private history: ICommand[] = [];


   async executeCommand(command: ICommand): Promise<void> {
      await command.execute();
      this.history.push(command);
      console.log(`📝 Command recorded: ${command.getDescription()}`);
   }

   async undoLast(): Promise<void> {
      const command = this.history.pop();
      if (!command) {
         throw new Error('No commands to undo');
      }
      await command.undo();
      console.log(`↩️ Command undone: ${command.getDescription()}`);
   }


   getHistorySize(): number {
      return this.history.length;
   }

   getHistoryDescriptions(): string[] {
      return this.history.map((cmd) => cmd.getDescription());
   }
}

export default CommandInvoker;
