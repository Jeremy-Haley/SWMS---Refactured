import React, { useState } from 'react';
import { Home, FileText, LogOut, Settings } from 'lucide-react';
import { useCompany } from '../../contexts/CompanyContext';
import { CompanySettings } from '../../Pages/CompanySettings';

export const Header = ({ currentView, onNavigateHome, onNavigateToForm }) => {
  const { company, signOut, user } = useCompany();
  const [showSettings, setShowSettings] = useState(false);

  const handleSignOut = async () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      try {
        await signOut();
      } catch (error) {
        console.error('Error signing out:', error);
      }
    }
  };

  // Use company color if available, otherwise default blue
  const primaryColor = company?.color || '#1e40af';
  const gradientEnd = lightenColor(primaryColor, 20);

  return (
    <>
      <div
        style={{
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${gradientEnd} 100%)`,
          color: 'white',
          padding: '24px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              {company?.logo && (
                <img
                  src={company.logo}
                  alt={company.name}
                  style={{
                    height: '50px',
                    marginBottom: '8px',
                  }}
                />
              )}
              <h1
                style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                }}
              >
                {company?.name || 'SWMS Manager'}
              </h1>
              <p style={{ fontSize: '16px', opacity: 0.9 }}>
                Safe Work Method Statements
                {company?.subscriptionStatus === 'trial' && (
                  <span
                    style={{
                      marginLeft: '12px',
                      background: 'rgba(255, 255, 255, 0.3)',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                    }}
                  >
                    🎉 FREE TRIAL
                  </span>
                )}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button
                onClick={onNavigateHome}
                style={{
                  background:
                    currentView === 'list'
                      ? 'white'
                      : 'rgba(255, 255, 255, 0.2)',
                  color: currentView === 'list' ? primaryColor : 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                }}
              >
                <Home size={20} />
                Home
              </button>

              <button
                onClick={onNavigateToForm}
                style={{
                  background:
                    currentView === 'form'
                      ? 'white'
                      : 'rgba(255, 255, 255, 0.2)',
                  color: currentView === 'form' ? primaryColor : 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                }}
              >
                <FileText size={20} />
                New SWMS
              </button>

              {/* Settings Button */}
              <button
                onClick={() => setShowSettings(true)}
                title="Company Settings"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  color: 'white',
                  padding: '12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'all 0.2s',
                }}
              >
                <Settings size={20} />
              </button>

              {/* User Menu */}
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 16px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                  }}
                >
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                      {user?.email}
                    </div>
                    <div style={{ fontSize: '12px', opacity: 0.8 }}>
                      {company?.userRole || 'User'}
                    </div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    title="Sign Out"
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      border: 'none',
                      color: 'white',
                      padding: '8px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <CompanySettings onClose={() => setShowSettings(false)} />
      )}
    </>
  );
};

// Helper function to lighten color
function lightenColor(color, percent) {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;
  return (
    '#' +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
}
