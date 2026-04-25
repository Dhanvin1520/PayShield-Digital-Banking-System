import React, { useEffect, useState } from 'react';
import { AlertTriangle, Send, X, AlertCircle, CheckCircle } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { transactionService, accountService } from '../services/bankingService';

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

interface Account {
   _id: string;
   accountNumber: string;
   type: string;
   balance: number;
}

interface Beneficiary {
   _id: string;
   accountNumber: string;
   userId: {
      _id: string;
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

function formatDateTime(dateVal: any) {
   if (!dateVal) return '—';
   try {
      const date = new Date(dateVal);
      if (isNaN(date.getTime())) return '—';

      return date.toLocaleString('en-IN', {
         day: 'numeric',
         month: 'short',
         year: 'numeric',
         hour: '2-digit',
         minute: '2-digit',
      });
   } catch {
      return '—';
   }
}

export default function TransactionsPage() {
   const [transactions, setTransactions] = useState<Transaction[]>([]);
   const [accounts, setAccounts] = useState<Account[]>([]);
   const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
   const [loading, setLoading] = useState(true);
   const [showModal, setShowModal] = useState(false);
   const [fromAccountId, setFromAccountId] = useState('');
   const [toAccountId, setToAccountId] = useState('');
   const [amount, setAmount] = useState('');
   const [description, setDescription] = useState('');
   const [submitting, setSubmitting] = useState(false);
   const [transferError, setTransferError] = useState('');
   const [transferResult, setTransferResult] = useState<{ flagged: boolean; message: string } | null>(null);

   // Group beneficiaries by user ID to avoid duplicate cards for teams with multiple accounts
   const uniqueTeammates = beneficiaries.reduce((acc: Beneficiary[], current) => {
      if (!current.userId) return acc;
      const existing = acc.find(b => b.userId._id === current.userId._id);
      if (!existing) return [...acc, current];
      return acc;
   }, []);

   async function load() {
      try {
         const [txRes, accRes, benRes] = await Promise.all([
            transactionService.getAll(100),
            accountService.getAll(),
            accountService.getBeneficiaries(),
         ]);
         setTransactions(txRes.data?.transactions || []);
         setAccounts(accRes.data?.accounts || []);
         setBeneficiaries(benRes.data?.beneficiaries || []);

         if (accRes.data?.accounts?.length > 0 && !fromAccountId) {
            setFromAccountId(accRes.data.accounts[0]._id);
         }
      } catch (err) {
         console.error('Failed to load transactions data', err);
      } finally {
         setLoading(false);
      }
   }

   useEffect(() => { load(); }, []);

   async function handleTransfer(e: React.FormEvent) {
      e.preventDefault();
      setSubmitting(true);
      setTransferError('');
      setTransferResult(null);
      try {
         const res = await transactionService.transfer(fromAccountId, toAccountId, Number(amount), description || undefined);
         const tx = res.data?.transaction;
         setTransferResult({
            flagged: tx?.flagged || false,
            message: tx?.flagged
               ? 'Transaction flagged for fraud review. Funds held pending investigation.'
               : 'Transfer completed successfully.',
         });
         setAmount('');
         setDescription('');
         setToAccountId('');
         load();
      } catch (err: any) {
         setTransferError(err?.response?.data?.message || 'Transfer failed. Check details and try again.');
      } finally {
         setSubmitting(false);
      }
   }

   function selectBeneficiary(id: string) {
      setToAccountId(id);
      setShowModal(true);
   }

   function openModal() {
      setShowModal(true);
      setTransferError('');
      setTransferResult(null);
      setAmount('');
      setDescription('');
      if (accounts.length > 0 && !fromAccountId) setFromAccountId(accounts[0]._id);
   }

   function getStatusBadge(tx: Transaction) {
      if (tx.flagged) return <span className="badge badge-warning">Flagged</span>;
      if (tx.status === 'completed') return <span className="badge badge-success">Completed</span>;
      return <span className="badge badge-neutral">{tx.status}</span>;
   }

   return (
      <AppLayout
         title="Transactions"
         subtitle="Full history of your fund movements"
         actions={
            <button className="btn btn-primary btn-sm" onClick={openModal} disabled={accounts.length === 0}>
               <Send size={14} /> New Transfer
            </button>
         }
      >
         <div className="card" style={{ marginBottom: 32 }}>
            <div className="card-header">
               <div>
                  <div className="card-title">Quick Pay Contacts</div>
                  <div className="card-subtitle">Select a teammate to start a transfer</div>
               </div>
            </div>

            {loading ? (
               <div className="spinner" />
            ) : uniqueTeammates.length === 0 ? (
               <div style={{ color: 'var(--color-text-muted)', fontSize: 13, padding: '20px' }}>
                  No teammates found in the system.
               </div>
            ) : (
               <div className="beneficiary-grid" style={{ marginTop: '16px' }}>
                  {uniqueTeammates.map((ben) => (
                     <div key={ben._id} className="beneficiary-item" onClick={() => selectBeneficiary(ben._id)}>
                        <div className="beneficiary-avatar">
                           {ben.userId.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="beneficiary-name">{ben.userId.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{ben.userId.email}</div>
                     </div>
                  ))}
               </div>
            )}
         </div>

         <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)' }}>
               <div className="card-title">Transaction History</div>
               <div className="card-subtitle">Showing latest 100 movements</div>
            </div>

            {loading ? (
               <div className="loading-wrapper">
                  <div className="spinner" />
                  <span className="loading-text">Loading transactions...</span>
               </div>
            ) : (
               <div style={{ overflowX: 'auto' }}>
                  <table className="data-table">
                     <thead>
                        <tr>
                           <th>From Account</th>
                           <th>To Account</th>
                           <th>Amount</th>
                           <th>Description</th>
                           <th>Date</th>
                           <th>Status</th>
                        </tr>
                     </thead>
                     <tbody>
                        {transactions.length === 0 ? (
                           <tr>
                              <td colSpan={6} style={{ textAlign: 'center', padding: 48, color: 'var(--color-text-muted)' }}>
                                 No transactions found.
                              </td>
                           </tr>
                        ) : (
                           transactions.map((tx) => (
                              <tr key={tx._id}>
                                 <td><span className="account-number">{tx.fromAccount?.accountNumber || 'N/A'}</span></td>
                                 <td><span className="account-number">{tx.toAccount?.accountNumber || 'N/A'}</span></td>
                                 <td style={{ fontWeight: 600 }}>{formatCurrency(tx.amount)}</td>
                                 <td style={{ color: 'var(--color-text-secondary)' }}>
                                    {tx.description || <span style={{ color: 'var(--color-text-muted)' }}>—</span>}
                                 </td>
                                 <td style={{ color: 'var(--color-text-secondary)' }}>
                                    {formatDateTime(tx.timestamp)}
                                 </td>
                                 <td>{getStatusBadge(tx)}</td>
                              </tr>
                           ))
                        )}
                     </tbody>
                  </table>
               </div>
            )}
         </div>

         {showModal && (
            <div className="modal-overlay" onClick={() => setShowModal(false)}>
               <div className="modal" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                     <div className="modal-title">New Transfer</div>
                     <button className="modal-close" onClick={() => setShowModal(false)}><X /></button>
                  </div>

                  <div className="modal-form">
                     {transferError && (
                        <div style={{ padding: '12px', marginBottom: '16px', backgroundColor: '#fef2f2', color: '#dc2626', borderRadius: '8px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                           <AlertCircle size={16} />
                           <span>{transferError}</span>
                        </div>
                     )}

                     {transferResult && (
                        <div style={{ padding: '12px', marginBottom: '16px', backgroundColor: transferResult.flagged ? '#fffbeb' : '#f0fdf4', color: transferResult.flagged ? '#d97706' : '#16a34a', borderRadius: '8px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                           {transferResult.flagged ? <AlertTriangle size={16} /> : <CheckCircle size={16} />}
                           <span>{transferResult.message}</span>
                        </div>
                     )}

                     <form onSubmit={handleTransfer}>
                        <div className="form-group">
                           <label className="form-label" htmlFor="from-account">From Account</label>
                           <select
                              id="from-account"
                              className="form-select"
                              value={fromAccountId}
                              onChange={(e) => setFromAccountId(e.target.value)}
                              required
                           >
                              {accounts.map((acc) => (
                                 <option key={acc._id} value={acc._id}>
                                    {acc.accountNumber} ({acc.type}) — {formatCurrency(acc.balance)}
                                 </option>
                              ))}
                           </select>
                        </div>

                        <div className="form-group">
                           <label className="form-label" htmlFor="to-account-id">Recipient Account ID</label>
                           <input
                              id="to-account-id"
                              className="form-input"
                              type="text"
                              placeholder="Enter recipient account ID"
                              value={toAccountId}
                              onChange={(e) => setToAccountId(e.target.value)}
                              required
                           />
                           {beneficiaries.some(b => b._id === toAccountId) && (
                              <span className="form-hint" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                                 Recipient: {beneficiaries.find(b => b._id === toAccountId)?.userId.name}
                              </span>
                           )}
                        </div>

                        <div className="form-group">
                           <label className="form-label" htmlFor="transfer-amount">Amount (INR)</label>
                           <input
                              id="transfer-amount"
                              className="form-input"
                              type="number"
                              placeholder="0.00"
                              min={1}
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                              required
                           />
                        </div>

                        <div className="form-group">
                           <label className="form-label" htmlFor="transfer-description">Note (Optional)</label>
                           <input
                              id="transfer-description"
                              className="form-input"
                              type="text"
                              placeholder="Reason for transfer"
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                           />
                        </div>

                        <div className="modal-actions" style={{ marginTop: '24px', padding: 0, background: 'none' }}>
                           <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                              Cancel
                           </button>
                           <button type="submit" className="btn btn-primary" disabled={submitting}>
                              {submitting ? 'Processing...' : 'Send Money'}
                           </button>
                        </div>
                     </form>
                  </div>
               </div>
            </div>
         )}
      </AppLayout>
   );
}
