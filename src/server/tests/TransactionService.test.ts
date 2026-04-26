/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TransactionService from '../services/TransactionService';
import Transaction from '../models/Transaction';
import Account from '../models/Account';
import FraudDetectionEngine from '../fraud/FraudDetectionEngine';
import CommandInvoker from '../patterns/command/CommandInvoker';

vi.mock('../models/Transaction', () => {
  return {
    default: vi.fn().mockImplementation(function (this: any, data: any) {
      Object.assign(this, data);
      this.save = vi.fn().mockResolvedValue(this);
    }),
  };
});
vi.mock('../models/Account');
vi.mock('../fraud/FraudDetectionEngine');
vi.mock('../patterns/command/CommandInvoker');

describe('TransactionService', () => {
  let service: TransactionService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new TransactionService();
  });

  describe('transfer', () => {
    it('should complete a transfer when not suspicious', async () => {
      const fromAcc = { _id: 'f1', balance: 1000 };
      const toAcc = { _id: 't1', balance: 0 };
      
      vi.mocked(Account.findById).mockImplementation((id: any) => {
        if (id === 'f1') return Promise.resolve(fromAcc as any);
        if (id === 't1') return Promise.resolve(toAcc as any);
        return Promise.resolve(null);
      });

      vi.mocked(FraudDetectionEngine.prototype.isTransactionSuspicious).mockResolvedValue(false);
      vi.mocked(CommandInvoker.prototype.executeCommand).mockResolvedValue(undefined);

      const result = await service.transfer('f1', 't1', 500, 'test transfer');

      expect(result.status).toBe('completed');
      expect(CommandInvoker.prototype.executeCommand).toHaveBeenCalled();
    });

    it('should flag a transaction if suspicious', async () => {
      const fromAcc = { _id: 'f1', balance: 1000 };
      const toAcc = { _id: 't1', balance: 0 };

      vi.mocked(Account.findById).mockImplementation((id: any) => {
        if (id === 'f1') return Promise.resolve(fromAcc as any);
        if (id === 't1') return Promise.resolve(toAcc as any);
        return Promise.resolve(null);
      });

      vi.mocked(FraudDetectionEngine.prototype.isTransactionSuspicious).mockResolvedValue(true);

      const result = await service.transfer('f1', 't1', 500, 'suspicious');

      expect(result.flagged).toBe(true);
      expect(result.status).toBe('flagged');
      expect(CommandInvoker.prototype.executeCommand).not.toHaveBeenCalled();
    });

    it('should throw error for insufficient balance', async () => {
      const fromAcc = { _id: 'f1', balance: 100 };
      const toAcc = { _id: 't1', balance: 0 };

      vi.mocked(Account.findById).mockImplementation((id: any) => {
        if (id === 'f1') return Promise.resolve(fromAcc as any);
        if (id === 't1') return Promise.resolve(toAcc as any);
        return Promise.resolve(null);
      });

      await expect(service.transfer('f1', 't1', 500)).rejects.toThrow('Insufficient balance');
    });
  });
});
