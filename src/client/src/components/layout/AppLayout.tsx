import { type ReactNode } from 'react';
import Sidebar from './Sidebar';

interface Props {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export default function AppLayout({ title, subtitle, actions, children }: Props) {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <header className="topbar">
          <div>
            <div className="topbar-title">{title}</div>
            {subtitle && <div className="topbar-subtitle">{subtitle}</div>}
          </div>
          {actions && <div>{actions}</div>}
        </header>
        <div className="page-content">{children}</div>
      </main>
    </div>
  );
}
