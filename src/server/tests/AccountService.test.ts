/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AccountService from '../services/AccountService';
import Account from '../models/Account';
import AccountFactory from '../patterns/factory/AccountFactory';

vi.mock('../models/Account');
vi.mock('../patterns/factory/AccountFactory');

describe('AccountService', () => {
  let service: AccountService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new AccountService();
  });

  describe('createAccount', () => {
    it('should call AccountFactory to create an account', async () => {
      const mockAccount = { userId: 'u1', type: 'savings', balance: 0 };
      vi.mocked(AccountFactory.createAccount).mockResolvedValue(mockAccount as any);

      const result = await service.createAccount('u1', 'savings' as any);
      expect(result).toEqual(mockAccount);
      expect(AccountFactory.createAccount).toHaveBeenCalledWith('savings', 'u1');
    });
  });

  describe('getAccountsByUserId', () => {
    it('should find accounts for a user and sort them', async () => {
      const mockAccounts = [{ id: '1' }, { id: '2' }];
      const mockFind = {
        sort: vi.fn().mockResolvedValue(mockAccounts)
      };
      vi.mocked(Account.find).mockReturnValue(mockFind as any);

      const result = await service.getAccountsByUserId('u1');
      expect(result).toEqual(mockAccounts);
      expect(Account.find).toHaveBeenCalledWith({ userId: 'u1' });
    });
  });

  describe('getTotalBalance', () => {
    it('should calculate the total balance of active accounts', async () => {
      const mockAccounts = [
        { balance: 100 },
        { balance: 250 }
      ];
      vi.mocked(Account.find).mockResolvedValue(mockAccounts as any);

      const total = await service.getTotalBalance('u1');
      expect(total).toBe(350);
      expect(Account.find).toHaveBeenCalledWith({ userId: 'u1', status: 'active' });
    });
  });
});
