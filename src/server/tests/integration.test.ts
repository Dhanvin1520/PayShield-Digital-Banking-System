import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../server';
import AuthService from '../services/AuthService';

vi.mock('../config/database', () => ({
  default: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../services/AuthService');

describe('API Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/health', () => {
    it('should return 200 and health status', async () => {
      const response = await request(app).get('/api/health');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('PayShield API is running');
    });
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password123',
      };

      const mockResult = {
        user: { id: '1', name: 'Jane Doe', email: 'jane@example.com' },
        token: 'mock-token',
      };

      vi.spyOn(AuthService.prototype, 'register').mockResolvedValue(mockResult as any);

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBe('mock-token');
      expect(AuthService.prototype.register).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Jane Doe',
        email: 'jane@example.com',
      }));
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Jane Doe' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('required');
    });
  });
});
