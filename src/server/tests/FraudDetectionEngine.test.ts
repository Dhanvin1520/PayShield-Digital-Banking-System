/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import FraudDetectionEngine from '../fraud/FraudDetectionEngine';
import { IFraudStrategy, FraudResult } from '../interfaces/IFraudRule';
import { ITransaction } from '../interfaces/ITransaction';
import { IAccount } from '../interfaces/IAccount';

vi.mock('../patterns/observer/FraudAlertObserver', () => ({
  handleFraudDetected: vi.fn(),
}));

describe('FraudDetectionEngine', () => {
  let engine: FraudDetectionEngine;
  let mockStrategy: IFraudStrategy;
  let mockTransaction: ITransaction;
  let mockAccount: IAccount;

  beforeEach(() => {
    engine = new FraudDetectionEngine();
    mockStrategy = {
      analyze: vi.fn().mockResolvedValue({
        flagged: false,
        ruleName: 'TestRule',
        reason: 'All good'
      } as FraudResult)
    };
    mockTransaction = { _id: '507f1f77bcf86cd799439011' } as any;
    mockAccount = { userId: '507f1f77bcf86cd799439012' } as any;
  });

  it('should allow adding a strategy', () => {
    engine.addStrategy(mockStrategy);
    expect(engine.getStrategyCount()).toBe(1);
  });

  it('should allow removing a strategy', () => {
    engine.addStrategy(mockStrategy);
    engine.removeStrategy(mockStrategy);
    expect(engine.getStrategyCount()).toBe(0);
  });

  it('should analyze a transaction and return results', async () => {
    engine.addStrategy(mockStrategy);
    const results = await engine.analyzeTransaction(mockTransaction, mockAccount);
    
    expect(results).toHaveLength(1);
    expect(results[0].ruleName).toBe('TestRule');
    expect(mockStrategy.analyze).toHaveBeenCalledWith(mockTransaction, mockAccount);
  });

  it('should flag a suspicious transaction', async () => {
    const suspiciousStrategy: IFraudStrategy = {
      analyze: vi.fn().mockResolvedValue({
        flagged: true,
        ruleName: 'SuspiciousRule',
        reason: 'High amount'
      } as FraudResult)
    };
    
    engine.addStrategy(suspiciousStrategy);
    const isSuspicious = await engine.isTransactionSuspicious(mockTransaction, mockAccount);
    
    expect(isSuspicious).toBe(true);
  });
});
