import React, { useEffect, useState } from 'react';
import { FileText, Plus, X, AlertCircle, CheckCircle, Shield, Check, XCircle } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { loanService } from '../services/bankingService';
import { useAuth } from '../context/AuthContext';

interface Loan {
  _id: string;
  amount: number;
  purpose: string;
  termMonths: number;
  interestRate: number;
  monthlyPayment: number;
  status: string;
  appliedAt: string;
  approvedAt?: string;
  userId?: {
    name: string;
    email: string;
  };
}

const LOAN_PURPOSES = [
  { value: 'personal', label: 'Personal' },
  { value: 'home', label: 'Home' },
  { value: 'education', label: 'Education' },
  { value: 'business', label: 'Business' },
  { value: 'vehicle', label: 'Vehicle' },
];

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

function getStatusBadge(status: string) {
  switch (status) {
    case 'approved': return <span className="badge badge-success">Approved</span>;
    case 'rejected': return <span className="badge badge-danger">Rejected</span>;
    case 'pending': return <span className="badge badge-warning">Pending</span>;
    default: return <span className="badge badge-neutral">{status}</span>;
  }
}

export default function LoansPage() {
  const { user } = useAuth();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('personal');
  const [termMonths, setTermMonths] = useState('12');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function load() {
    try {
      setLoading(true);
      const res = user?.role === 'admin' 
        ? await loanService.adminGetAll()
        : await loanService.getAll();
      setLoans(res.data?.loans || []);
    } catch {
      setError('Failed to load loans.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [user]);

  const emiPreview = amount && termMonths
    ? ((Number(amount) * (1 + 10 / 100)) / Number(termMonths)).toFixed(2)
    : null;

  async function handleApply(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await loanService.apply(Number(amount), purpose, Number(termMonths));
      setSuccess('Loan application submitted. It will be reviewed shortly.');
      setShowModal(false);
      setAmount('');
      setPurpose('personal');
      setTermMonths('12');
      load();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to submit loan application.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdateStatus(loanId: string, status: string) {
    try {
      await loanService.updateStatus(loanId, status);
      setSuccess(`Loan successfully ${status}.`);
      load();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err: any) {
      setError(err?.response?.data?.message || `Failed to ${status} loan.`);
    }
  }

  return (
    <AppLayout
      title={user?.role === 'admin' ? "Loan Oversight" : "Loans"}
      subtitle={user?.role === 'admin' ? "Review and process customer loan applications" : "Apply and track your loan applications"}
      actions={
        user?.role !== 'admin' && (
          <button className="btn btn-primary btn-sm" onClick={() => { setShowModal(true); setError(''); }}>
            <Plus size={14} /> Apply for Loan
          </button>
        )
      }
    >
      {success && (
        <div className="alert alert-success" style={{ marginBottom: 20 }}>
          <CheckCircle size={16} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: 20 }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="loading-wrapper">
          <div className="spinner" />
          <span className="loading-text">Loading loans...</span>
        </div>
      ) : loans.length === 0 ? (
        <div className="empty-state" style={{ paddingTop: 80 }}>
          <div className="empty-state-icon" style={{ width: 64, height: 64 }}>
            <FileText size={28} />
          </div>
          <div className="empty-state-title">No loan applications</div>
          <div className="empty-state-desc">
            {user?.role === 'admin' 
              ? "There are currently no customer loan applications to review."
              : "Apply for a personal, home, education, or business loan. Get instant EMI calculations."}
          </div>
          {user?.role !== 'admin' && (
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              <Plus size={14} /> Apply for Loan
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {loans.map((loan) => (
            <div className="loan-card" key={loan._id}>
              <div className="loan-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className={`avatar-sm ${user?.role === 'admin' ? 'blue' : ''}`}>
                    {user?.role === 'admin' ? <Shield size={14} /> : <FileText size={14} />}
                  </div>
                  <div>
                    <div className="loan-purpose">{loan.purpose} Loan</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>
                      {user?.role === 'admin' ? `Customer: ${loan.userId?.name}` : `Applied ${formatDate(loan.appliedAt)}`}
                    </div>
                  </div>
                </div>
                {getStatusBadge(loan.status)}
              </div>
              
              <div className="loan-meta">
                <div className="loan-meta-item">
                  <div className="loan-meta-label">Loan Amount</div>
                  <div className="loan-meta-value">{formatCurrency(loan.amount)}</div>
                </div>
                <div className="loan-meta-item">
                  <div className="loan-meta-label">Monthly EMI</div>
                  <div className="loan-meta-value">{formatCurrency(loan.monthlyPayment)}</div>
                </div>
                <div className="loan-meta-item">
                  <div className="loan-meta-label">Interest Rate</div>
                  <div className="loan-meta-value">{loan.interestRate}% p.a.</div>
                </div>
                <div className="loan-meta-item">
                  <div className="loan-meta-label">Term</div>
                  <div className="loan-meta-value">{loan.termMonths} months</div>
                </div>
              </div>

              {user?.role === 'admin' && loan.status === 'pending' && (
                <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--color-border-subtle)', display: 'flex', gap: 12 }}>
                  <button 
                    className="btn btn-success btn-sm" 
                    onClick={() => handleUpdateStatus(loan._id, 'approved')}
                    style={{ flex: 1 }}
                  >
                    <Check size={14} /> Approve Loan
                  </button>
                  <button 
                    className="btn btn-danger btn-sm" 
                    onClick={() => handleUpdateStatus(loan._id, 'rejected')}
                    style={{ flex: 1 }}
                  >
                    <XCircle size={14} /> Reject Application
                  </button>
                </div>
              )}

              {(loan.approvedAt || (user?.role === 'admin' && loan.status !== 'pending')) && (
                <div style={{ marginTop: 12, fontSize: 12, color: loan.status === 'approved' ? 'var(--color-success)' : 'var(--color-danger)' }}>
                  {loan.status === 'approved' 
                    ? `Approved on ${formatDate(loan.approvedAt || loan.appliedAt)}` 
                    : `Application rejected`}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Loan Application</div>
              <button className="modal-close" onClick={() => setShowModal(false)}><X /></button>
            </div>

            <form className="modal-form" onSubmit={handleApply}>
              <div className="form-group">
                <label className="form-label" htmlFor="loan-purpose">Purpose</label>
                <select
                  id="loan-purpose"
                  className="form-select"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                >
                  {LOAN_PURPOSES.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="loan-amount">Loan Amount (INR)</label>
                <input
                  id="loan-amount"
                  className="form-input"
                  type="number"
                  placeholder="100000"
                  min={1000}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="loan-term">Repayment Period</label>
                <select
                  id="loan-term"
                  className="form-select"
                  value={termMonths}
                  onChange={(e) => setTermMonths(e.target.value)}
                >
                  <option value="6">6 months</option>
                  <option value="12">12 months</option>
                  <option value="24">24 months</option>
                  <option value="36">36 months</option>
                  <option value="60">60 months</option>
                </select>
              </div>

              {emiPreview && (
                <div className="alert alert-info">
                  <FileText size={16} />
                  <div>
                    <div style={{ fontWeight: 600 }}>EMI Estimate</div>
                    <div>Rs.{Number(emiPreview).toLocaleString('en-IN')} / month at 10% p.a.</div>
                  </div>
                </div>
              )}

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting} id="loan-apply-submit">
                  {submitting ? <><span className="spinner spinner-sm" /> Submitting...</> : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
