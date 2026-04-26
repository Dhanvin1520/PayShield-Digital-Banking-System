/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DashboardPage from './DashboardPage';
import { useAuth } from '../context/AuthContext';
import { accountService, transactionService, loanService } from '../services/bankingService';

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../services/bankingService', () => ({
  accountService: {
    getAll: vi.fn(),
    getTotalBalance: vi.fn(),
  },
  transactionService: {
    getAll: vi.fn(),
    getFlagged: vi.fn(),
  },
  loanService: {
    getAll: vi.fn(),
  },
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue({
      user: { name: 'John Doe', role: 'user' },
    });

    (accountService.getAll as any).mockResolvedValue({ data: { accounts: [] } });
    (accountService.getTotalBalance as any).mockResolvedValue({ data: { totalBalance: 1000 } });
    (transactionService.getAll as any).mockResolvedValue({ data: { transactions: [] } });
    (loanService.getAll as any).mockResolvedValue({ data: { loans: [] } });
  });

  it('renders loading state initially', () => {
    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    expect(screen.getByText('Loading your dashboard...')).toBeInTheDocument();
  });

  it('renders the dashboard content after loading', async () => {
    (accountService.getAll as any).mockResolvedValue({
      data: {
        accounts: [{ _id: '1', accountNumber: 'ACC123', type: 'savings', balance: 500, status: 'active' }]
      }
    });

    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading your dashboard...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Welcome back, John.')).toBeInTheDocument();
    expect(screen.getByText('Net Liquidity')).toBeInTheDocument();
    expect(screen.getByText('₹1,000.00')).toBeInTheDocument();
    expect(screen.getByText('ACC123')).toBeInTheDocument();
  });

  it('renders admin features for admin users', async () => {
    (useAuth as any).mockReturnValue({
      user: { name: 'Admin User', role: 'admin' },
    });
    (transactionService.getFlagged as any).mockResolvedValue({ data: { transactions: [] } });

    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Admin Terminal')).toBeInTheDocument();
    });

    expect(screen.getByText('Administrative Oversight')).toBeInTheDocument();
    expect(screen.getByText('Pending Fraud Alerts')).toBeInTheDocument();
  });
});
