import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CreditCard,
  ArrowLeftRight,
  FileText,
  Shield,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <ShieldCheck size={28} />
        <span>PayShield</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/dashboard"
          className={({ isActive }: { isActive: boolean }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>

        <NavLink
          to="/accounts"
          className={({ isActive }: { isActive: boolean }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <CreditCard size={20} />
          Accounts
        </NavLink>

        <NavLink
          to="/transactions"
          className={({ isActive }: { isActive: boolean }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <ArrowLeftRight size={20} />
          Transactions
        </NavLink>

        <NavLink
          to="/loans"
          className={({ isActive }: { isActive: boolean }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <FileText size={20} />
          Loans
        </NavLink>

        {user?.role === 'admin' && (
          <NavLink
            to="/fraud"
            className={({ isActive }: { isActive: boolean }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Shield size={20} />
            Fraud Alerts
          </NavLink>
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile-sm">
          <div className="avatar-sm">{initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>{user?.role}</div>
          </div>
          <button 
            onClick={handleLogout} 
            style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: 4 }}
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
