import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type Mode = 'login' | 'register';

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login, register, isLoading } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (mode === 'login') {
        await login(email, password);
        navigate('/dashboard');
      } else {
        await register(name, email, password);
        setSuccess('Account created. Redirecting...');
        setTimeout(() => navigate('/dashboard'), 800);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Something went wrong. Please try again.';
      if (msg.includes('Account not found')) {
        setError("We couldn't find an account with that email. Would you like to create one?");
      } else {
        setError(msg);
      }
    }
  }

  function switchMode(m: Mode) {
    setMode(m);
    setError('');
    setSuccess('');
    setName('');
    setEmail('');
    setPassword('');
  }

  return (
    <div className="auth-layout">
      <div className="auth-panel-left">
        <div className="auth-brand">
          <div className="auth-brand-icon">
            <ShieldCheck />
          </div>
          <div className="auth-brand-name">PayShield</div>
        </div>

        <h1 className="auth-headline">
          Banking built for<br />
          <span>the modern era.</span>
        </h1>

        <p className="auth-tagline">
          Manage your finances with confidence. Real-time fraud detection,
          instant transfers, and intelligent loan management — all in one place.
        </p>

        <ul className="auth-features">
          <li className="auth-feature">
            <div className="auth-feature-dot" />
            Real-time fraud detection with rule-based engine
          </li>
          <li className="auth-feature">
            <div className="auth-feature-dot" />
            Instant fund transfers between accounts
          </li>
          <li className="auth-feature">
            <div className="auth-feature-dot" />
            Personal, home, education, and business loans
          </li>
          <li className="auth-feature">
            <div className="auth-feature-dot" />
            End-to-end JWT authentication and bcrypt security
          </li>
        </ul>
      </div>

      <div className="auth-panel-right">
        <div className="auth-card">
          <h2 className="auth-card-title">
            {mode === 'login' ? 'Sign in' : 'Create account'}
          </h2>
          <p className="auth-card-sub">
            {mode === 'login'
              ? 'Enter your credentials to access your account.'
              : 'Fill in the details below to get started.'}
          </p>

          {error && (
            <div className="alert alert-danger" style={{ marginBottom: 16 }}>
              <AlertCircle />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="alert alert-success" style={{ marginBottom: 16 }}>
              <CheckCircle />
              <span>{success}</span>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div className="form-group">
                <label className="form-label" htmlFor="name">Full Name</label>
                <input
                  id="name"
                  className="form-input"
                  type="text"
                  placeholder="Arjun Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input
                id="email"
                className="form-input"
                type="email"
                placeholder="arjun@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                id="password"
                className="form-input"
                type="password"
                placeholder={mode === 'register' ? 'At least 6 characters' : 'Your password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full btn-lg"
              disabled={isLoading}
              id={mode === 'login' ? 'login-submit' : 'register-submit'}
            >
              {isLoading ? (
                <>
                  <span className="spinner spinner-sm" />
                  {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                </>
              ) : mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <p className="auth-switch">
            {mode === 'login' ? (
              <>
                No account?{' '}
                <a onClick={() => switchMode('register')}>Create one</a>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <a onClick={() => switchMode('login')}>Sign in</a>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
