import { useEffect, useState } from 'react';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { transactionService } from '../services/bankingService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface FlaggedTransaction {
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

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function FraudPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [flagged, setFlagged] = useState<FlaggedTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    async function load() {
      try {
        const res = await transactionService.getFlagged();
        setFlagged(res.data?.transactions || []);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to load flagged transactions.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user, navigate]);

  function getFromAcc(tx: FlaggedTransaction) {
    if (typeof tx.fromAccount === 'object' && tx.fromAccount?.accountNumber)
      return tx.fromAccount.accountNumber;
    return 'N/A';
  }

  function getToAcc(tx: FlaggedTransaction) {
    if (typeof tx.toAccount === 'object' && tx.toAccount?.accountNumber)
      return tx.toAccount.accountNumber;
    return 'N/A';
  }

  return (
    <AppLayout
      title="Fraud Alerts"
      subtitle="Transactions flagged by the fraud detection engine"
    >
      {error && (
        <div className="alert alert-danger" style={{ marginBottom: 20 }}>
          <AlertTriangle size={16} />
          <span>{error}</span>
        </div>
      )}

      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 28 }}>
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-card-icon red"><AlertTriangle /></div>
          </div>
          <div className="stat-value">{flagged.length}</div>
          <div className="stat-label">Flagged Transactions</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-card-icon blue"><Shield /></div>
          </div>
          <div className="stat-value">3</div>
          <div className="stat-label">Active Rules</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-card-icon green"><CheckCircle /></div>
          </div>
          <div className="stat-value">Auto</div>
          <div className="stat-label">Detection Mode</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <div>
            <div className="card-title">Detection Rules</div>
            <div className="card-subtitle">Strategy pattern — rules are interchangeable without engine modification</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { rule: 'High Value Transfer', trigger: 'Single transaction exceeds Rs.50,000', severity: 'High' },
            { rule: 'Rapid Transactions', trigger: 'More than 3 transactions within 60 seconds', severity: 'High' },
            { rule: 'New Recipient', trigger: 'First-time transfer to an unknown account', severity: 'Low' },
          ].map((r) => (
            <div key={r.rule} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--color-border-subtle)' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>{r.rule}</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>{r.trigger}</div>
              </div>
              <span className={`badge ${r.severity === 'High' ? 'badge-danger' : 'badge-warning'}`}>
                {r.severity}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)' }}>
          <div className="card-title">Flagged Transactions</div>
          <div className="card-subtitle">{flagged.length} transactions pending review</div>
        </div>

        {loading ? (
          <div className="loading-wrapper">
            <div className="spinner" />
            <span className="loading-text">Loading fraud data...</span>
          </div>
        ) : flagged.length === 0 ? (
          <div className="empty-state" style={{ padding: 48 }}>
            <div className="empty-state-icon"><CheckCircle size={24} /></div>
            <div className="empty-state-title">No flagged transactions</div>
            <div className="empty-state-desc">
              The fraud engine has not flagged any transactions currently.
            </div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>From</th>
                  <th>To</th>
                  <th>Amount</th>
                  <th>Description</th>
                  <th>Flagged At</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {flagged.map((tx) => (
                  <tr key={tx._id}>
                    <td><span className="mono-text">{getFromAcc(tx)}</span></td>
                    <td><span className="mono-text">{getToAcc(tx)}</span></td>
                    <td>
                      <span style={{ fontWeight: 600, color: 'var(--color-danger)' }}>
                        {formatCurrency(tx.amount)}
                      </span>
                    </td>
                    <td style={{ color: 'var(--color-text-secondary)' }}>
                      {tx.description || <span style={{ color: 'var(--color-text-muted)' }}>—</span>}
                    </td>
                    <td style={{ color: 'var(--color-text-secondary)' }}>
                      {formatDateTime(tx.timestamp)}
                    </td>
                    <td><span className="badge badge-warning">Under Review</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
