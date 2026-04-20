import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, Search } from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';

export default function DashboardLayout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="layout">
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              className="btn btn-icon btn-secondary"
              style={{ display: 'none' }}
              id="menu-btn"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <h1 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--gray-900)' }}>
              {title}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              className="btn btn-icon btn-secondary"
              style={{ position: 'relative' }}
              onClick={() => navigate('/notifications')}
            >
              <Bell size={18} />
              <span className="notif-dot" />
            </button>

            <div
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                cursor: 'pointer', padding: '0.375rem 0.75rem',
                borderRadius: 'var(--radius-sm)', background: 'var(--gray-100)'
              }}
              onClick={() => navigate(
                user?.role === 'STUDENT' ? '/student/profile' : '/profile/me'
              )}
            >
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'var(--primary-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)'
              }}>
                {user?.fullName?.[0]?.toUpperCase() || '?'}
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--gray-700)' }}>
                {user?.fullName?.split(' ')[0]}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="page-content fade-in">
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #menu-btn { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
