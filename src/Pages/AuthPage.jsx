import React, { useState } from 'react';
import { useCompany } from '../contexts/CompanyContext';
import { Building2, Mail, Lock, User, FileText } from 'lucide-react';

export const AuthPage = () => {
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { signIn, signUp } = useCompany();

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [signupData, setSignupData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    companyAbn: '',
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signIn(loginData.email, loginData.password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (signupData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await signUp(
        signupData.email,
        signupData.password,
        signupData.fullName,
        signupData.companyName,
        signupData.companyAbn
      );
      
      alert('Account created! Please check your email to verify your account.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #eff6ff, #dbeafe)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          maxWidth: '500px',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: '#1e40af',
            color: 'white',
            padding: '32px',
            textAlign: 'center',
          }}
        >
          <FileText size={48} style={{ margin: '0 auto 16px' }} />
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>
            SWMS Manager
          </h1>
          <p style={{ fontSize: '14px', opacity: 0.9 }}>
            Professional Safety Documentation for Builders
          </p>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            borderBottom: '2px solid #e5e7eb',
          }}
        >
          <button
            onClick={() => setMode('login')}
            style={{
              flex: 1,
              padding: '16px',
              background: mode === 'login' ? 'white' : '#f9fafb',
              border: 'none',
              borderBottom: mode === 'login' ? '3px solid #1e40af' : 'none',
              fontWeight: 'bold',
              color: mode === 'login' ? '#1e40af' : '#6b7280',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            Login
          </button>
          <button
            onClick={() => setMode('signup')}
            style={{
              flex: 1,
              padding: '16px',
              background: mode === 'signup' ? 'white' : '#f9fafb',
              border: 'none',
              borderBottom: mode === 'signup' ? '3px solid #1e40af' : 'none',
              fontWeight: 'bold',
              color: mode === 'signup' ? '#1e40af' : '#6b7280',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '32px' }}>
          {error && (
            <div
              style={{
                background: '#fee2e2',
                border: '2px solid #ef4444',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '20px',
                color: '#dc2626',
                fontSize: '14px',
              }}
            >
              {error}
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    fontSize: '14px',
                  }}
                >
                  <Mail size={16} style={{ display: 'inline', marginRight: '6px' }} />
                  Email
                </label>
                <input
                  type="email"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                  }}
                  placeholder="your@email.com"
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    fontSize: '14px',
                  }}
                >
                  <Lock size={16} style={{ display: 'inline', marginRight: '6px' }} />
                  Password
                </label>
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                  }}
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  background: loading ? '#9ca3af' : '#1e40af',
                  color: 'white',
                  padding: '14px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  fontSize: '16px',
                }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignup}>
              <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    fontSize: '14px',
                  }}
                >
                  <User size={16} style={{ display: 'inline', marginRight: '6px' }} />
                  Your Full Name
                </label>
                <input
                  type="text"
                  value={signupData.fullName}
                  onChange={(e) =>
                    setSignupData({ ...signupData, fullName: e.target.value })
                  }
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                  }}
                  placeholder="John Smith"
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    fontSize: '14px',
                  }}
                >
                  <Mail size={16} style={{ display: 'inline', marginRight: '6px' }} />
                  Email
                </label>
                <input
                  type="email"
                  value={signupData.email}
                  onChange={(e) =>
                    setSignupData({ ...signupData, email: e.target.value })
                  }
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                  }}
                  placeholder="your@email.com"
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    fontSize: '14px',
                  }}
                >
                  <Building2 size={16} style={{ display: 'inline', marginRight: '6px' }} />
                  Company Name
                </label>
                <input
                  type="text"
                  value={signupData.companyName}
                  onChange={(e) =>
                    setSignupData({ ...signupData, companyName: e.target.value })
                  }
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                  }}
                  placeholder="ABC Builders PTY LTD"
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    fontSize: '14px',
                  }}
                >
                  ABN (Optional)
                </label>
                <input
                  type="text"
                  value={signupData.companyAbn}
                  onChange={(e) =>
                    setSignupData({ ...signupData, companyAbn: e.target.value })
                  }
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                  }}
                  placeholder="12 345 678 901"
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    fontSize: '14px',
                  }}
                >
                  <Lock size={16} style={{ display: 'inline', marginRight: '6px' }} />
                  Password
                </label>
                <input
                  type="password"
                  value={signupData.password}
                  onChange={(e) =>
                    setSignupData({ ...signupData, password: e.target.value })
                  }
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                  }}
                  placeholder="••••••••"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    fontSize: '14px',
                  }}
                >
                  <Lock size={16} style={{ display: 'inline', marginRight: '6px' }} />
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={signupData.confirmPassword}
                  onChange={(e) =>
                    setSignupData({ ...signupData, confirmPassword: e.target.value })
                  }
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                  }}
                  placeholder="••••••••"
                />
              </div>

              <div
                style={{
                  background: '#f0f9ff',
                  border: '2px solid #3b82f6',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '20px',
                  fontSize: '13px',
                  color: '#1e40af',
                }}
              >
                <strong>🎉 14-Day Free Trial</strong>
                <br />
                Then $75/month. Cancel anytime.
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  background: loading ? '#9ca3af' : '#10b981',
                  color: 'white',
                  padding: '14px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  fontSize: '16px',
                }}
              >
                {loading ? 'Creating Account...' : 'Start Free Trial'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
