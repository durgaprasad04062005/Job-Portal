import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Users, TrendingUp, CheckCircle, PlusCircle, Eye } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { dashboardAPI, jobsAPI } from '../../api/jobs';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../../components/ui/Spinner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#0ea5e9'];

export default function EmployerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, jobsRes] = await Promise.all([
          dashboardAPI.getEmployerStats(),
          jobsAPI.getMyJobs({ page: 0, size: 5 }),
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
    { label: 'Jobs Posted', value: stats?.jobsPosted || 0, icon: Briefcase, color: 'blue' },
    { label: 'Active Openings', value: stats?.activeOpenings || 0, icon: TrendingUp, color: 'green' },
    { label: 'Total Applicants', value: stats?.totalApplicants || 0, icon: Users, color: 'purple' },
    { label: 'Shortlisted', value: stats?.shortlistedCount || 0, icon: CheckCircle, color: 'orange' },
    { label: 'Hired', value: stats?.hiredCount || 0, icon: CheckCircle, color: 'teal' },
    { label: 'Rejected', value: stats?.rejectedCount || 0, icon: Users, color: 'red' },
  ];

  const pieData = stats ? [
    { name: 'Applied', value: stats.totalApplicants - stats.shortlistedCount - stats.rejectedCount - stats.hiredCount },
    { name: 'Shortlisted', value: stats.shortlistedCount },
    { name: 'Hired', value: stats.hiredCount },
    { name: 'Rejected', value: stats.rejectedCount },
  ].filter(d => d.value > 0) : [];

  return (
    <DashboardLayout title="Employer Dashboard">
      {/* Welcome */}
      <div style={{
        background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
        borderRadius: 'var(--radius-lg)', padding: '2rem', marginBottom: '2rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem'
      }}>
        <div>
          <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Welcome, {user?.companyName || user?.fullName}! 🏢
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)' }}>
            Manage your job postings and find the best talent
          </p>
        </div>
        <button className="btn" style={{ background: '#fff', color: '#0284c7', fontWeight: 700 }} onClick={() => navigate('/employer/post-job')}>
          <PlusCircle size={16} /> Post New Job
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}><Spinner size="lg" /></div>
      ) : (
        <>
          {/* Stats */}
          <div className="stats-grid" style={{ marginBottom: '2rem' }}>
            {statCards.map(card => (
              <div key={card.label} className="stat-card">
                <div className={`stat-icon ${card.color}`}><card.icon size={22} /></div>
                <div>
                  <div className="stat-value">{card.value}</div>
                  <div className="stat-label">{card.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          {pieData.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <div className="card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Application Status</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Hiring Funnel</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={[
                    { name: 'Applied', count: stats?.totalApplicants || 0 },
                    { name: 'Shortlisted', count: stats?.shortlistedCount || 0 },
                    { name: 'Hired', count: stats?.hiredCount || 0 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-200)" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Recent jobs */}
          <div className="card">
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontWeight: 700 }}>Recent Job Postings</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => navigate('/employer/jobs')}>View All</button>
            </div>
            {recentJobs.length === 0 ? (
              <div className="empty-state" style={{ padding: '3rem' }}>
                <h3>No jobs posted yet</h3>
                <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/employer/post-job')}>
                  Post Your First Job
                </button>
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Job Title</th>
                      <th>Status</th>
                      <th>Applicants</th>
                      <th>Posted</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentJobs.map(job => (
                      <tr key={job.id}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{job.title}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{job.location} • {job.jobType?.replace('_', ' ')}</div>
                        </td>
                        <td>
                          <span className={`badge ${job.status === 'ACTIVE' ? 'badge-success' : 'badge-gray'}`}>
                            {job.status}
                          </span>
                        </td>
                        <td>{job.applicationCount}</td>
                        <td style={{ fontSize: '0.8125rem', color: 'var(--gray-500)' }}>
                          {new Date(job.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/employer/jobs/${job.id}/applicants`)}>
                            <Eye size={13} /> Applicants
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
