/**
 * ICommand — Command Pattern Interface
 * 
 * Defines the contract for all banking transaction commands.
 * Each command encapsulates a transaction as an object,
 * supporting execute and undo operations.
 * 
 * Design Pattern: Command (Behavioral)
 * OOP: Polymorphism — all commands implement the same interface
 * Use Case: Financial transactions need to be trackable and reversible
 */
export interface ICommand {
  
  execute(): Promise<void>;


  undo(): Promise<void>;

 
  getDescription(): string;
}
