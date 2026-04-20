import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ExternalLink, Trash2, Eye } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { applicationsAPI } from '../../api/jobs';
import Pagination from '../../components/ui/Pagination';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';

const STATUS_LABELS = {
  APPLIED: { label: 'Applied', class: 'status-applied' },
  UNDER_REVIEW: { label: 'Under Review', class: 'status-under_review' },
  SHORTLISTED: { label: 'Shortlisted', class: 'status-shortlisted' },
  REJECTED: { label: 'Rejected', class: 'status-rejected' },
  HIRED: { label: 'Hired 🎉', class: 'status-hired' },
  WITHDRAWN: { label: 'Withdrawn', class: 'status-withdrawn' },
};

export default function StudentApplications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [withdrawId, setWithdrawId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await applicationsAPI.getMyApplications({ page, size: 10 });
      const data = res.data.data;
      setApplications(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApplications(); }, [page]);

  const handleWithdraw = async () => {
    try {
      await applicationsAPI.withdraw(withdrawId);
      toast.success('Application withdrawn');
      fetchApplications();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to withdraw');
    }
  };

  const filtered = statusFilter
    ? applications.filter(a => a.status === statusFilter)
    : applications;

  return (
    <DashboardLayout title="My Applications">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontWeight: 700, fontSize: '1.25rem' }}>Application History</h2>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>Track all your job applications</p>
        </div>
        <select className="form-select" style={{ width: 'auto' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><Spinner size="xl" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><FileText size={48} color="var(--gray-300)" /></div>
          <h3>No applications yet</h3>
          <p>Start applying to jobs to see them here</p>
          <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/jobs')}>
            Browse Jobs
          </button>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filtered.map(app => {
              const status = STATUS_LABELS[app.status] || { label: app.status, class: 'status-applied' };
              return (
                <div key={app.id} className="card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>{app.jobTitle}</h3>
                        <span className={`badge ${status.class}`}>{status.label}</span>
                      </div>
                      <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                        {app.companyName} • {app.jobLocation} • {app.jobType?.replace('_', ' ')}
                      </p>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--gray-400)' }}>
                        Applied {new Date(app.appliedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                      {app.employerNote && (
                        <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'var(--gray-50)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--primary)' }}>
                          <p style={{ fontSize: '0.8125rem', color: 'var(--gray-600)' }}>
                            <strong>Employer note:</strong> {app.employerNote}
                          </p>
                        </div>
                      )}
                      {app.interviewDate && (
                        <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#d1fae5', borderRadius: 'var(--radius-sm)' }}>
                          <p style={{ fontSize: '0.8125rem', color: '#065f46' }}>
                            🗓 Interview scheduled: {app.interviewDate} • {app.interviewType} • {app.interviewLocation}
                          </p>
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/jobs/${app.jobId}`)}>
                        <Eye size={14} /> View Job
                      </button>
                      {!['HIRED', 'WITHDRAWN', 'REJECTED'].includes(app.status) && (
                        <button className="btn btn-danger btn-sm" onClick={() => setWithdrawId(app.id)}>
                          <Trash2 size={14} /> Withdraw
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      <ConfirmDialog
        isOpen={!!withdrawId}
        onClose={() => setWithdrawId(null)}
        onConfirm={handleWithdraw}
        title="Withdraw Application"
        message="Are you sure you want to withdraw this application? This action cannot be undone."
        confirmText="Withdraw"
        danger
      />
    </DashboardLayout>
  );
}
