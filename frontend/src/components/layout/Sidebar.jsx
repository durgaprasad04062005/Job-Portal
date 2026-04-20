import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../ui/Logo';
import {
  LayoutDashboard, Briefcase, FileText, Bookmark, User,
  Bell, LogOut, PlusCircle, Users, Shield
} from 'lucide-react';

const studentNav = [
  { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/jobs', icon: Briefcase, label: 'Browse Jobs' },
  { to: '/student/applications', icon: FileText, label: 'My Applications' },
  { to: '/student/saved-jobs', icon: Bookmark, label: 'Saved Jobs' },
  { to: '/student/profile', icon: User, label: 'My Profile' },
  { to: '/notifications', icon: Bell, label: 'Notifications' },
];

const employerNav = [
  { to: '/employer/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/employer/post-job', icon: PlusCircle, label: 'Post a Job' },
  { to: '/employer/jobs', icon: Briefcase, label: 'Manage Jobs' },
  { to: '/profile/me', icon: User, label: 'Company Profile' },
  { to: '/notifications', icon: Bell, label: 'Notifications' },
];

const adminNav = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/users', icon: Users, label: 'Manage Users' },
  { to: '/admin/jobs', icon: Briefcase, label: 'Manage Jobs' },
  { to: '/notifications', icon: Bell, label: 'Notifications' },
];

export default function Sidebar({ mobileOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = user?.role === 'STUDENT' ? studentNav
    : user?.role === 'EMPLOYER' ? employerNav
    : adminNav;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleLabel = user?.role === 'STUDENT' ? 'Job Seeker'
    : user?.role === 'EMPLOYER' ? 'Employer'
    : 'Administrator';

  const roleColor = user?.role === 'STUDENT' ? '#6366f1'
    : user?.role === 'EMPLOYER' ? '#0ea5e9'
    : '#f59e0b';

  return (
    <>
      {mobileOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99 }}
          onClick={onClose}
        />
      )}
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <Logo size="sm" dark />
        </div>

        {/* User info */}
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: roleColor + '33',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem', fontWeight: 700, color: roleColor, flexShrink: 0
            }}>
              {user?.fullName?.[0]?.toUpperCase() || '?'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.fullName}
              </div>
              <div style={{ fontSize: '0.7rem', color: roleColor, fontWeight: 600 }}>
                {roleLabel}
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <button className="sidebar-nav-item" onClick={handleLogout} style={{ width: '100%', color: '#fca5a5' }}>
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
