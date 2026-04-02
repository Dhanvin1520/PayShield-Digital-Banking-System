import { IFraudStrategy, FraudResult } from '../interfaces/IFraudRule';
import { ITransaction } from '../interfaces/ITransaction';
import { IAccount } from '../interfaces/IAccount';
import TransactionEventEmitter from '../patterns/observer/EventEmitter';
import { handleFraudDetected } from '../patterns/observer/FraudAlertObserver';

/**
 * FraudDetectionEngine
 * 
 * Orchestrates multiple fraud detection strategies using the Strategy Pattern.
 * Uses the Observer Pattern to notify subscribers when fraud is detected.
 * 
 * Demonstrates:
 * - Strategy Pattern: Interchangeable fraud rules
 * - Observer Pattern: Event-driven fraud alerts
 * - Open/Closed Principle: New strategies added without modifying engine
 * - Single Responsibility: Only handles fraud analysis
 */
class FraudDetectionEngine {
  private strategies: IFraudStrategy[] = [];
  private eventEmitter: TransactionEventEmitter;

  constructor() {
    this.eventEmitter = new TransactionEventEmitter();
    // Register the fraud alert observer
    this.eventEmitter.subscribe('fraud.detected', handleFraudDetected);
  }

  /**
   * Add a fraud detection strategy
   * Open/Closed: Engine is open for extension (new strategies)
   * but closed for modification (engine code doesn't change)
   */
  addStrategy(strategy: IFraudStrategy): void {
    this.strategies.push(strategy);
    console.log(`🛡️ Fraud strategy added: ${strategy.constructor.name}`);
  }

  /**
   * Remove a fraud detection strategy
   */
  removeStrategy(strategy: IFraudStrategy): void {
    const index = this.strategies.indexOf(strategy);
    if (index > -1) {
      this.strategies.splice(index, 1);
    }
  }

  /**
   * Analyze a transaction against all registered strategies
   * Polymorphism: Each strategy's analyze() method is called uniformly
   * 
   * @param transaction - The transaction to analyze
   * @param account - The source account
   * @returns Array of fraud analysis results
   */
  async analyzeTransaction(
    transaction: ITransaction,
    account: IAccount
  ): Promise<FraudResult[]> {
    const results: FraudResult[] = [];

    for (const strategy of this.strategies) {
      const result = await strategy.analyze(transaction, account);
      results.push(result);

      // If fraud is detected, emit an event (Observer pattern)
      if (result.flagged) {
        this.eventEmitter.emit('fraud.detected', {
          transactionId: transaction._id,
          userId: account.userId,
          ruleTriggered: result.ruleName,
          severity: result.severity || 'medium',
          description: result.reason || 'Suspicious activity detected',
        });
      }
    }

    return results;
  }

  /**
   * Check if any strategy flagged the transaction
   */
  async isTransactionSuspicious(
    transaction: ITransaction,
    account: IAccount
  ): Promise<boolean> {
    const results = await this.analyzeTransaction(transaction, account);
    return results.some((r) => r.flagged);
  }

  /**
   * Get the number of registered strategies
   */
  getStrategyCount(): number {
    return this.strategies.length;
  }
}

export default FraudDetectionEngine;
