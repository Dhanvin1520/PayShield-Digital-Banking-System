import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, ArrowLeftRight, FileText, AlertTriangle, Shield, Smartphone } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { accountService, transactionService, loanService } from '../services/bankingService';
import { useAuth } from '../context/AuthContext';

interface Account {
  _id: string;
  accountNumber: string;
  type: string;
  balance: number;
  status: string;
}

interface Transaction {
  _id: string;
  fromAccount: any;
  toAccount: any;
  amount: number;
  type: string;
  status: string;
  flagged: boolean;
  description?: string;
  timestamp: string;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loans, setLoans] = useState<any[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [flaggedTransactions, setFlaggedTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [accRes, txRes, loanRes, balRes] = await Promise.all([
          accountService.getAll(),
          transactionService.getAll(5),
          loanService.getAll(),
          accountService.getTotalBalance(),
        ]);
        setAccounts(accRes.data?.accounts || []);
        setTransactions(txRes.data?.transactions || []);
        setLoans(loanRes.data?.loans || []);
        setTotalBalance(balRes.data?.totalBalance || 0);

        if (user?.role === 'admin') {
          const flaggedRes = await transactionService.getFlagged();
          setFlaggedTransactions(flaggedRes.data?.transactions || []);
        }
      } catch {
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  const activeLoans = loans.filter((l) => l.status === 'approved').length;

  if (loading) {
    return (
      <AppLayout title="Dashboard">
        <div className="loading-wrapper">
          <div className="spinner" />
          <span className="loading-text">Loading your dashboard...</span>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title={user?.role === 'admin' ? "Admin Terminal" : "Dashboard"}
      subtitle={`Welcome back, ${user?.name?.split(' ')[0]}.`}
    >
      {user?.role === 'admin' && (
        <div className="card" style={{ marginBottom: 32, border: '1px solid var(--color-primary)', backgroundColor: '#eff6ff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div className="stat-card-icon blue"><Shield /></div>
            <div>
              <div className="card-title" style={{ color: 'var(--color-primary)' }}>Administrative Oversight</div>
              <div className="card-subtitle" style={{ marginBottom: 0 }}>System-wide monitoring enabled</div>
            </div>
          </div>
          <div className="stat-grid" style={{ marginBottom: 0 }}>
            <div className="stat-card">
              <div className="stat-value">{flaggedTransactions.length}</div>
              <div className="stat-label">Pending Fraud Alerts</div>
              <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }} onClick={() => navigate('/fraud')}>
                Investigation Pool
              </button>
            </div>
            <div className="stat-card">
              <div className="stat-value">{loans.filter(l => l.status === 'pending').length}</div>
              <div className="stat-label">Pending Loan Apps</div>
              <button className="btn btn-secondary btn-sm" style={{ marginTop: 12 }} onClick={() => navigate('/loans')}>
                Review Desk
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-card-icon blue"><CreditCard /></div>
          </div>
          <div className="stat-value">{formatCurrency(totalBalance)}</div>
          <div className="stat-label">Net Liquidity</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-card-icon green"><Smartphone /></div>
          </div>
          <div className="stat-value">{accounts.length}</div>
          <div className="stat-label">Active Accounts</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-card-icon yellow"><FileText /></div>
          </div>
          <div className="stat-value">{activeLoans}</div>
          <div className="stat-label">Current Loans</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-card-icon red"><AlertTriangle /></div>
          </div>
          <div className="stat-value">{transactions.filter(t => t.flagged).length}</div>
          <div className="stat-label">Risk Flags (Self)</div>
        </div>
      </div>

      <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24 }}>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Recent Activity</div>
              <div className="card-subtitle">Showing latest 5 movements</div>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/transactions')}>View All</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {transactions.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon"><ArrowLeftRight /></div>
                <div className="empty-state-desc">No transactions found.</div>
              </div>
            ) : (
              transactions.map((tx) => (
                <div key={tx._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--color-border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className={`avatar-sm ${tx.flagged ? 'red' : 'blue'}`} style={{ backgroundColor: tx.flagged ? '#fef2f2' : '#eff6ff', color: tx.flagged ? '#dc2626' : '#2563eb' }}>
                      {tx.flagged ? <AlertTriangle size={14} /> : <ArrowLeftRight size={14} />}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{tx.description || 'Fund Transfer'}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{formatDate(tx.timestamp)}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{formatCurrency(tx.amount)}</div>
                    {tx.flagged && <span className="badge badge-danger">FLAGGED</span>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Portfolio</div>
              <div className="card-subtitle">Manage your accounts</div>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/accounts')}>Manage</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {accounts.map((acc) => (
              <div key={acc._id} className="beneficiary-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--color-bg)', cursor: 'default' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="avatar-sm"><CreditCard size={14} /></div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, textTransform: 'capitalize' }}>{acc.type} Account</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{acc.accountNumber}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800 }}>{formatCurrency(acc.balance)}</div>
                  <span className="badge badge-success">Active</span>
                </div>
              </div>
            ))}
            {accounts.length === 0 && (
              <div className="empty-state">
                <button className="btn btn-primary btn-sm" onClick={() => navigate('/accounts')}>Open First Account</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
