import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, User, Mail, Phone, MapPin, FileText } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { applicationsAPI, jobsAPI } from '../../api/jobs';
import Modal from '../../components/ui/Modal';
import Pagination from '../../components/ui/Pagination';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';

const STATUSES = ['APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'REJECTED', 'HIRED'];

const STATUS_COLORS = {
  APPLIED: 'status-applied',
  UNDER_REVIEW: 'status-under_review',
  SHORTLISTED: 'status-shortlisted',
  REJECTED: 'status-rejected',
  HIRED: 'status-hired',
};

export default function ViewApplicants() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [note, setNote] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    jobsAPI.getById(jobId).then(res => setJob(res.data.data)).catch(() => navigate('/employer/jobs'));
  }, [jobId]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await applicationsAPI.getJobApplications(jobId, { page, size: 10, status: statusFilter || undefined });
      const data = res.data.data;
      setApplications(data.content);
      setTotalPages(data.totalPages);
    } catch {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApplications(); }, [page, statusFilter]);

  const handleStatusUpdate = async (appId, status) => {
    setUpdating(true);
    try {
      await applicationsAPI.updateStatus(appId, status, note);
      toast.success(`Application ${status.toLowerCase()}`);
      setSelectedApp(null);
      setNote('');
      fetchApplications();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <DashboardLayout title="View Applicants">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <button className="btn btn-icon btn-secondary" onClick={() => navigate('/employer/jobs')}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 style={{ fontWeight: 700, fontSize: '1.25rem' }}>{job?.title || 'Loading...'}</h2>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>{job?.companyName} • {job?.location}</p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['', ...STATUSES].map(s => (
          <button
            key={s}
            className={`btn btn-sm ${statusFilter === s ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => { setStatusFilter(s); setPage(0); }}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      <div className="card">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><Spinner size="xl" /></div>
        ) : applications.length === 0 ? (
          <div className="empty-state">
            <h3>No applications found</h3>
            <p>No applicants match the selected filter</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th>Applied</th>
                  <th>Resume</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--primary)', flexShrink: 0 }}>
                          {app.applicantName?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{app.applicantName}</div>
                          {app.applicantLocation && <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{app.applicantLocation}</div>}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.8125rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--gray-600)' }}>
                          <Mail size={12} /> {app.applicantEmail}
                        </div>
                        {app.applicantPhone && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--gray-500)', marginTop: '0.25rem' }}>
                            <Phone size={12} /> {app.applicantPhone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${STATUS_COLORS[app.status] || 'badge-gray'}`}>
                        {app.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8125rem', color: 'var(--gray-500)' }}>
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                    <td>
                      {app.resumeUrl && (
                        <a
                          href={app.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-secondary btn-sm"
                          download
                        >
                          <Download size={13} /> Resume
                        </a>
                      )}
                    </td>
                    <td>
                      <button className="btn btn-primary btn-sm" onClick={() => { setSelectedApp(app); setNote(app.employerNote || ''); }}>
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {/* Review modal */}
      <Modal
        isOpen={!!selectedApp}
        onClose={() => { setSelectedApp(null); setNote(''); }}
        title="Review Application"
        size="lg"
      >
        {selectedApp && (
          <div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.5rem', padding: '1rem', background: 'var(--gray-50)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--primary)', fontSize: '1.25rem', flexShrink: 0 }}>
                {selectedApp.applicantName?.[0]?.toUpperCase()}
              </div>
              <div>
                <h3 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{selectedApp.applicantName}</h3>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.8125rem', color: 'var(--gray-500)' }}>
                  <span><Mail size={12} style={{ display: 'inline', marginRight: 4 }} />{selectedApp.applicantEmail}</span>
                  {selectedApp.applicantPhone && <span><Phone size={12} style={{ display: 'inline', marginRight: 4 }} />{selectedApp.applicantPhone}</span>}
                  {selectedApp.applicantLocation && <span><MapPin size={12} style={{ display: 'inline', marginRight: 4 }} />{selectedApp.applicantLocation}</span>}
                </div>
              </div>
            </div>

            {selectedApp.coverLetter && (
              <div style={{ marginBottom: '1.25rem' }}>
                <h4 style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9375rem' }}>Cover Letter</h4>
                <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem', lineHeight: 1.7, background: 'var(--gray-50)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                  {selectedApp.coverLetter}
                </p>
              </div>
            )}

            <div style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">Note to Applicant (optional)</label>
              <textarea className="form-textarea" value={note} onChange={e => setNote(e.target.value)} rows={3} placeholder="Add a note for the applicant..." />
            </div>

            <div>
              <label className="form-label">Update Status</label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {STATUSES.filter(s => s !== selectedApp.status).map(s => (
                  <button
                    key={s}
                    className={`btn btn-sm ${s === 'SHORTLISTED' || s === 'HIRED' ? 'btn-success' : s === 'REJECTED' ? 'btn-danger' : 'btn-secondary'}`}
                    onClick={() => handleStatusUpdate(selectedApp.id, s)}
                    disabled={updating}
                  >
                    {updating ? <Spinner size="sm" /> : s.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
