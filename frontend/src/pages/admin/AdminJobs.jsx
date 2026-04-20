import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Trash2 } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { adminAPI } from '../../api/jobs';
import Pagination from '../../components/ui/Pagination';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';

export default function AdminJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getAllJobs({ page, size: 15, status: statusFilter || undefined });
      const data = res.data.data;
      setJobs(data.content);
      setTotalPages(data.totalPages);
    } catch {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, [page, statusFilter]);

  const handleDelete = async () => {
    try {
      await adminAPI.deleteJob(deleteId);
      toast.success('Job deleted');
      fetchJobs();
    } catch {
      toast.error('Failed to delete job');
    }
  };

  return (
    <DashboardLayout title="Manage Jobs">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontWeight: 700, fontSize: '1.25rem' }}>All Job Postings</h2>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>Review and moderate job listings</p>
        </div>
        <select className="form-select" style={{ width: 'auto' }} value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(0); }}>
          <option value="">All Status</option>
          {['ACTIVE', 'CLOSED', 'DRAFT', 'EXPIRED'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><Spinner size="xl" /></div>
        ) : jobs.length === 0 ? (
          <div className="empty-state"><h3>No jobs found</h3></div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Applicants</th>
                  <th>Posted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(job => (
                  <tr key={job.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{job.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{job.location} • {job.jobType?.replace('_', ' ')}</div>
                    </td>
                    <td style={{ fontSize: '0.875rem' }}>{job.companyName}</td>
                    <td><span className="badge badge-gray" style={{ fontSize: '0.7rem' }}>{job.category}</span></td>
                    <td>
                      <span className={`badge ${job.status === 'ACTIVE' ? 'badge-success' : job.status === 'DRAFT' ? 'badge-warning' : 'badge-gray'}`}>
                        {job.status}
                      </span>
                    </td>
                    <td>{job.applicationCount}</td>
                    <td style={{ fontSize: '0.8125rem', color: 'var(--gray-500)' }}>
                      {new Date(job.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.375rem' }}>
                        <button className="btn btn-icon btn-secondary" onClick={() => navigate(`/jobs/${job.id}`)}>
                          <Eye size={14} />
                        </button>
                        <button className="btn btn-icon btn-danger" onClick={() => setDeleteId(job.id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Job"
        message="Are you sure you want to permanently delete this job posting?"
        confirmText="Delete"
        danger
      />
    </DashboardLayout>
  );
}
