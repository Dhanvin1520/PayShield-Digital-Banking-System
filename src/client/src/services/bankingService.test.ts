/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService, accountService, transactionService } from './bankingService';
import api from './api';

vi.mock('./api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
  },
}));

describe('bankingService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('authService', () => {
    it('should login and return user data', async () => {
      const mockResponse = { data: { success: true, data: { user: { name: 'Test' }, token: 'abc' } } };
      vi.mocked(api.post).mockResolvedValue(mockResponse as any);

      const result = await authService.login('test@test.com', 'password');
      expect(result.success).toBe(true);
      expect(result.data.user.name).toBe('Test');
      expect(api.post).toHaveBeenCalledWith('/auth/login', { email: 'test@test.com', password: 'password' });
    });
  });

  describe('accountService', () => {
    it('should fetch all accounts', async () => {
      const mockAccounts = { data: { success: true, data: [{ id: '1', balance: 100 }] } };
      vi.mocked(api.get).mockResolvedValue(mockAccounts as any);

      const result = await accountService.getAll();
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(api.get).toHaveBeenCalledWith('/accounts');
    });
  });

  describe('transactionService', () => {
    it('should perform a transfer', async () => {
      const mockRes = { data: { success: true, message: 'Transfer successful' } };
      vi.mocked(api.post).mockResolvedValue(mockRes as any);

      const result = await transactionService.transfer('a1', 'a2', 50, 'gift');
      expect(result.success).toBe(true);
      expect(api.post).toHaveBeenCalledWith('/transactions/transfer', {
        fromAccountId: 'a1',
        toAccountId: 'a2',
        amount: 50,
        description: 'gift'
      });
    });
  });
});
