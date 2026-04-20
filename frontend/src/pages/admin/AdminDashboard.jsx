import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Briefcase, FileText, TrendingUp, Shield, Activity } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { dashboardAPI } from '../../api/jobs';
import Spinner from '../../components/ui/Spinner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#0ea5e9'];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardAPI.getAdminStats()
      .then(res => setStats(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'blue' },
    { label: 'Job Seekers', value: stats?.totalStudents || 0, icon: Users, color: 'purple' },
    { label: 'Employers', value: stats?.totalEmployers || 0, icon: Briefcase, color: 'orange' },
    { label: 'Total Jobs', value: stats?.totalJobs || 0, icon: Briefcase, color: 'green' },
    { label: 'Active Jobs', value: stats?.activeJobs || 0, icon: Activity, color: 'teal' },
    { label: 'Applications', value: stats?.totalApplications || 0, icon: FileText, color: 'red' },
  ];

  const appStatusData = stats?.applicationsByStatus
    ? Object.entries(stats.applicationsByStatus).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <DashboardLayout title="Admin Dashboard">
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        borderRadius: 'var(--radius-lg)', padding: '2rem', marginBottom: '2rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem'
      }}>
        <div>
          <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Admin Control Panel 🛡️
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)' }}>
            Monitor and manage the entire platform
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn" style={{ background: '#fff', color: '#d97706', fontWeight: 700 }} onClick={() => navigate('/admin/users')}>
            <Users size={16} /> Manage Users
          </button>
          <button className="btn" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }} onClick={() => navigate('/admin/jobs')}>
            <Briefcase size={16} /> Manage Jobs
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}><Spinner size="lg" /></div>
      ) : (
        <>
          <div className="stats-grid" style={{ marginBottom: '2rem' }}>
            {statCards.map(card => (
              <div key={card.label} className="stat-card">
                <div className={`stat-icon ${card.color}`}><card.icon size={22} /></div>
                <div>
                  <div className="stat-value">{card.value.toLocaleString()}</div>
                  <div className="stat-label">{card.label}</div>
                </div>
              </div>
            ))}
          </div>

          {appStatusData.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <div className="card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Applications by Status</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={appStatusData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-200)" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Platform Overview</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Students', value: stats?.totalStudents || 0 },
                        { name: 'Employers', value: stats?.totalEmployers || 0 },
                      ]}
                      cx="50%" cy="50%" outerRadius={80} dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {[0, 1].map(i => <Cell key={i} fill={COLORS[i]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Quick actions */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {[
              { icon: '👥', label: 'All Users', desc: 'View and manage users', path: '/admin/users', color: '#dbeafe' },
              { icon: '💼', label: 'All Jobs', desc: 'Review job postings', path: '/admin/jobs', color: '#d1fae5' },
              { icon: '🔔', label: 'Notifications', desc: 'System notifications', path: '/notifications', color: '#ede9fe' },
            ].map(action => (
              <button
                key={action.label}
                onClick={() => navigate(action.path)}
                style={{
                  background: 'var(--white)', border: '1px solid var(--gray-200)',
                  borderRadius: 'var(--radius)', padding: '1.25rem',
                  textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s',
                  boxShadow: 'var(--shadow)'
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
              >
                <div style={{ width: 44, height: 44, background: action.color, borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '0.75rem' }}>
                  {action.icon}
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.9375rem', marginBottom: '0.25rem' }}>{action.label}</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--gray-500)' }}>{action.desc}</div>
              </button>
            ))}
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
