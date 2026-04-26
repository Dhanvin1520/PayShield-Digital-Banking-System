/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AuthController from '../controllers/AuthController';
import AuthService from '../services/AuthService';

vi.mock('../services/AuthService');

describe('AuthController', () => {
  let mockReq: any;
  let mockRes: any;
  let mockNext: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockReq = {
      body: {},
      user: { id: '507f1f77bcf86cd799439011' }
    };
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis()
    };
    mockNext = vi.fn();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      mockReq.body = { name: 'Test User', email: 'test@example.com', password: 'password123' };
      const mockResult = { user: { id: '1', name: 'Test User' }, token: 'token' };
      
      vi.spyOn(AuthService.prototype, 'register').mockResolvedValue(mockResult as any);

      await AuthController.register(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'User registered successfully',
        data: mockResult
      });
    });

    it('should return 400 if fields are missing', async () => {
      mockReq.body = { email: 'test@example.com' };

      await AuthController.register(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Name, email, and password are required'
      });
    });
  });

  describe('login', () => {
    it('should login successfully', async () => {
      mockReq.body = { email: 'test@example.com', password: 'password123' };
      const mockResult = { user: { id: '1', name: 'Test User' }, token: 'token' };

      vi.spyOn(AuthService.prototype, 'login').mockResolvedValue(mockResult as any);

      await AuthController.login(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Login successful',
        data: mockResult
      });
    });
  });
});
