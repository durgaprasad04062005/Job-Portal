import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, FileText, Bookmark, TrendingUp, Search, Bell, User } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { dashboardAPI, jobsAPI } from '../../api/jobs';
import { useAuth } from '../../context/AuthContext';
import JobCard from '../../components/jobs/JobCard';
import Spinner from '../../components/ui/Spinner';

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, jobsRes] = await Promise.all([
          dashboardAPI.getStudentStats(),
          jobsAPI.search({ size: 6, sortBy: 'createdAt', sortDir: 'desc' }),
        ]);
        setStats(statsRes.data.data);
        setRecentJobs(jobsRes.data.data.content);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const statCards = [
    { label: 'Jobs Applied', value: stats?.appliedJobs || 0, icon: FileText, color: 'blue' },
    { label: 'Saved Jobs', value: stats?.savedJobs || 0, icon: Bookmark, color: 'purple' },
    { label: 'Under Review', value: stats?.underReviewCount || 0, icon: TrendingUp, color: 'orange' },
    { label: 'Shortlisted', value: stats?.shortlistedCount || 0, icon: TrendingUp, color: 'green' },
  ];

  return (
    <DashboardLayout title="Student Dashboard">
      {/* Welcome banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
        borderRadius: 'var(--radius-lg)', padding: '2rem', marginBottom: '2rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem'
      }}>
        <div>
          <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Welcome back, {user?.fullName?.split(' ')[0]}! 👋
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)' }}>
            {user?.profileCompleteness < 80
              ? `Complete your profile to get better job matches (${user?.profileCompleteness}% done)`
              : 'Your profile is looking great! Keep applying.'}
          </p>
          {user?.profileCompleteness < 100 && (
            <div style={{ marginTop: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)' }}>Profile Completeness</span>
                <span style={{ fontSize: '0.75rem', color: '#fff', fontWeight: 600 }}>{user?.profileCompleteness}%</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.2)', borderRadius: 9999 }}>
                <div style={{ height: '100%', width: `${user?.profileCompleteness}%`, background: '#fff', borderRadius: 9999, transition: 'width 0.5s' }} />
              </div>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn" style={{ background: '#fff', color: 'var(--primary)', fontWeight: 700 }} onClick={() => navigate('/jobs')}>
            <Search size={16} /> Browse Jobs
          </button>
          <button className="btn" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }} onClick={() => navigate('/student/profile')}>
            <User size={16} /> Update Profile
          </button>
        </div>
      </div>

      {/* Stats */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}><Spinner size="lg" /></div>
      ) : (
        <>
          <div className="stats-grid" style={{ marginBottom: '2rem' }}>
            {statCards.map(card => (
              <div key={card.label} className="stat-card">
                <div className={`stat-icon ${card.color}`}>
                  <card.icon size={22} />
                </div>
                <div>
                  <div className="stat-value">{card.value}</div>
                  <div className="stat-label">{card.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {[
              { icon: '🔍', label: 'Browse Jobs', desc: 'Find new opportunities', path: '/jobs', color: '#dbeafe' },
              { icon: '📄', label: 'My Applications', desc: 'Track your progress', path: '/student/applications', color: '#d1fae5' },
              { icon: '🔖', label: 'Saved Jobs', desc: 'Jobs you bookmarked', path: '/student/saved-jobs', color: '#ede9fe' },
              { icon: '👤', label: 'Edit Profile', desc: 'Update your info', path: '/student/profile', color: '#ffedd5' },
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

          {/* Recent jobs */}
          <div>
            <div className="section-header">
              <h2 className="section-title">Latest Job Openings</h2>
              <button className="btn btn-secondary btn-sm" onClick={() => navigate('/jobs')}>View All</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: '1.25rem' }}>
              {recentJobs.map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
