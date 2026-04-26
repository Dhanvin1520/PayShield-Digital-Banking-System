import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';

vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Sidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue({
      user: { name: 'John Doe', role: 'user' },
      logout: vi.fn(),
    });
  });

  it('renders the logo and basic navigation links', () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );

    expect(screen.getByText('PayShield')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Accounts')).toBeInTheDocument();
    expect(screen.getByText('Transactions')).toBeInTheDocument();
    expect(screen.getByText('Loans')).toBeInTheDocument();
  });

  it('renders Fraud Alerts link only for admins', () => {
    const { rerender } = render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );

    expect(screen.queryByText('Fraud Alerts')).not.toBeInTheDocument();

    (useAuth as any).mockReturnValue({
      user: { name: 'Admin User', role: 'admin' },
      logout: vi.fn(),
    });

    rerender(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );

    expect(screen.getByText('Fraud Alerts')).toBeInTheDocument();
  });

  it('calls logout and navigates on logout button click', () => {
    const mockLogout = vi.fn();
    (useAuth as any).mockReturnValue({
      user: { name: 'John Doe', role: 'user' },
      logout: mockLogout,
    });

    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );

    const logoutButton = screen.getByTitle('Logout');
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
