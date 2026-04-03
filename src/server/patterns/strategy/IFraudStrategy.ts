import { IFraudStrategy, FraudResult } from '../../interfaces/IFraudRule';
import { ITransaction } from '../../interfaces/ITransaction';
import { IAccount } from '../../interfaces/IAccount';

/**
 * IFraudStrategy — Strategy Pattern Interface
 * 
 * This file re-exports the interface for clarity.
 * All concrete strategies must implement the analyze() method.
 * 
 * Design Pattern: Strategy (Behavioral)
 * SOLID: Open/Closed Principle — add new strategies without touching existing code
 * OOP: Polymorphism — all strategies treated uniformly through this interface
 */

export { IFraudStrategy, FraudResult };
