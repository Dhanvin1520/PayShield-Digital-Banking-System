import { useEffect, useState } from 'react';
import { CreditCard, Plus, ArrowRight, Shield, User, X, CheckCircle, AlertCircle } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { accountService } from '../services/bankingService';
import { useAuth } from '../context/AuthContext';

interface Account {
   _id: string;
   accountNumber: string;
   type: string;
   balance: number;
   status: string;
   interestRate?: number;
   overdraftLimit?: number;
   userId?: {
      name: string;
      email: string;
   };
}

function formatCurrency(amount: number) {
   return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
   }).format(amount);
}

export default function AccountsPage() {
   const { user } = useAuth();
   const [accounts, setAccounts] = useState<Account[]>([]);
   const [loading, setLoading] = useState(true);
   const [showModal, setShowModal] = useState(false);
   const [accountType, setAccountType] = useState<'savings' | 'checking'>('savings');
   const [creating, setCreating] = useState(false);
   const [error, setError] = useState('');
   const [successMsg, setSuccessMsg] = useState('');

   async function loadAccounts() {
      try {
         setLoading(true);
         const res = user?.role === 'admin'
            ? await accountService.adminGetAll()
            : await accountService.getAll();
         setAccounts(res.data?.accounts || []);
      } catch (err: any) {
         setError(err?.response?.data?.message || 'Failed to load accounts.');
      } finally {
         setLoading(false);
      }
   }

   useEffect(() => {
      loadAccounts();
   }, [user]);

   async function handleCreate(e: React.FormEvent) {
      e.preventDefault();
      setCreating(true);
      setError('');
      try {
         await accountService.create(accountType);
         setSuccessMsg(`${accountType.charAt(0).toUpperCase() + accountType.slice(1)} account created.`);
         setShowModal(false);
         loadAccounts();
         setTimeout(() => setSuccessMsg(''), 3000);
      } catch (err: any) {
         setError(err?.response?.data?.message || 'Failed to create account.');
      } finally {
         setCreating(false);
      }
   }

   return (
      <AppLayout
         title={user?.role === 'admin' ? "System Accounts" : "My Accounts"}
         subtitle={user?.role === 'admin' ? "Snapshot of all active customer accounts across PayShield" : "Manage your savings and checking accounts"}
         actions={
            user?.role !== 'admin' && (
               <button className="btn btn-primary btn-sm" onClick={() => { setShowModal(true); setError(''); }}>
                  <Plus size={14} /> Open Account
               </button>
            )
         }
      >
         {successMsg && (
            <div className="alert alert-success" style={{ marginBottom: 20 }}>
               <CheckCircle size={16} />
               <span>{successMsg}</span>
            </div>
         )}

         {error && (
            <div className="alert alert-danger" style={{ marginBottom: 24 }}>
               <AlertCircle size={16} />
               <span>{error}</span>
            </div>
         )}

         {loading ? (
            <div className="loading-wrapper">
               <div className="spinner" />
               <span className="loading-text">Loading accounts...</span>
            </div>
         ) : accounts.length === 0 ? (
            <div className="empty-state" style={{ paddingTop: 80 }}>
               <div className="empty-state-icon" style={{ width: 64, height: 64 }}>
                  <CreditCard size={28} />
               </div>
               <div className="empty-state-title">No accounts found</div>
               <div className="empty-state-desc">
                  {user?.role === 'admin'
                     ? "There are currently no system accounts to monitor."
                     : "Open a savings or checking account to start banking with PayShield."}
               </div>
               {user?.role !== 'admin' && (
                  <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                     <Plus size={14} /> Open Account
                  </button>
               )}
            </div>
         ) : (
            <div className="accounts-grid">
               {accounts.map((acc) => (
                  <div className="account-card" key={acc._id}>
                     <div className="account-card-header">
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                           <div className="account-type-badge" style={{ textTransform: 'capitalize' }}>
                              <div className="account-status-dot" />
                              {acc.type}
                           </div>
                           {user?.role === 'admin' && acc.userId && (
                              <div style={{ fontSize: 11, color: 'var(--color-primary)', fontWeight: 600, marginTop: 4 }}>
                                 Customer: {acc.userId.name}
                              </div>
                           )}
                        </div>
                        <div className="account-number">{acc.accountNumber}</div>
                     </div>
                     <div className="account-balance">{formatCurrency(acc.balance)}</div>
                     <div className="account-balance-label">Available Balance</div>
                     <div className="divider" />
                     <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--color-text-muted)' }}>
                        {acc.type === 'savings' && acc.interestRate && (
                           <span>Rate: {(acc.interestRate * 100).toFixed(1)}%</span>
                        )}
                        {acc.type === 'checking' && acc.overdraftLimit && (
                           <span>Limit: {formatCurrency(acc.overdraftLimit)}</span>
                        )}
                        <span style={{ marginLeft: 'auto' }}>
                           Status: <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>Active</span>
                        </span>
                     </div>
                  </div>
               ))}
            </div>
         )}

         {showModal && (
            <div className="modal-overlay" onClick={() => setShowModal(false)}>
               <div className="modal" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                     <div className="modal-title">Open New Account</div>
                     <button className="modal-close" onClick={() => setShowModal(false)}><X /></button>
                  </div>

                  <form className="modal-form" onSubmit={handleCreate}>
                     <div className="form-group">
                        <label className="form-label" htmlFor="account-type">Account Type</label>
                        <select
                           id="account-type"
                           className="form-select"
                           value={accountType}
                           onChange={(e) => setAccountType(e.target.value as any)}
                        >
                           <option value="savings">Savings — 4% annual interest</option>
                           <option value="checking">Checking — Rs.5,000 overdraft limit</option>
                        </select>
                     </div>

                     <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                           Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={creating} id="create-account-submit">
                           {creating ? <><span className="spinner spinner-sm" /> Creating...</> : 'Create Account'}
                        </button>
                     </div>
                  </form>
               </div>
            </div>
         )}
      </AppLayout>
   );
}
