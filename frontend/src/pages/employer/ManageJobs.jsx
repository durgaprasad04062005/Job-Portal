import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Edit, Trash2, Eye, Users, ToggleLeft, ToggleRight } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { jobsAPI } from '../../api/jobs';
import Pagination from '../../components/ui/Pagination';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';

export default function ManageJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [deleteId, setDeleteId] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await jobsAPI.getMyJobs({ page, size: 10 });
      const data = res.data.data;
      setJobs(data.content);
      setTotalPages(data.totalPages);
    } catch {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, [page]);

  const handleDelete = async () => {
    try {
      await jobsAPI.delete(deleteId);
      toast.success('Job deleted');
      fetchJobs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  const toggleStatus = async (job) => {
    const newStatus = job.status === 'ACTIVE' ? 'CLOSED' : 'ACTIVE';
    try {
      await jobsAPI.updateStatus(job.id, newStatus);
      toast.success(`Job ${newStatus === 'ACTIVE' ? 'activated' : 'closed'}`);
      fetchJobs();
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <DashboardLayout title="Manage Jobs">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontWeight: 700, fontSize: '1.25rem' }}>My Job Postings</h2>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>Manage and track your job listings</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/employer/post-job')}>
          <PlusCircle size={16} /> Post New Job
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><Spinner size="xl" /></div>
        ) : jobs.length === 0 ? (
          <div className="empty-state">
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
                  <th>Type</th>
                  <th>Status</th>
                  <th>Applicants</th>
                  <th>Views</th>
                  <th>Posted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(job => (
                  <tr key={job.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{job.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{job.location}</div>
                    </td>
                    <td><span className="badge badge-gray">{job.jobType?.replace('_', ' ')}</span></td>
                    <td>
                      <span className={`badge ${job.status === 'ACTIVE' ? 'badge-success' : job.status === 'DRAFT' ? 'badge-warning' : 'badge-gray'}`}>
                        {job.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/employer/jobs/${job.id}/applicants`)}>
                        <Users size={13} /> {job.applicationCount}
                      </button>
                    </td>
                    <td style={{ color: 'var(--gray-500)' }}>{job.viewCount}</td>
                    <td style={{ fontSize: '0.8125rem', color: 'var(--gray-500)' }}>
                      {new Date(job.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.375rem' }}>
                        <button className="btn btn-icon btn-secondary" title="View" onClick={() => navigate(`/jobs/${job.id}`)}>
                          <Eye size={14} />
                        </button>
                        <button className="btn btn-icon btn-secondary" title="Edit" onClick={() => navigate('/employer/post-job', { state: { job } })}>
                          <Edit size={14} />
                        </button>
                        <button
                          className="btn btn-icon btn-secondary"
                          title={job.status === 'ACTIVE' ? 'Close job' : 'Activate job'}
                          onClick={() => toggleStatus(job)}
                        >
                          {job.status === 'ACTIVE' ? <ToggleRight size={14} color="var(--success)" /> : <ToggleLeft size={14} />}
                        </button>
                        <button className="btn btn-icon btn-danger" title="Delete" onClick={() => setDeleteId(job.id)}>
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
        message="Are you sure you want to delete this job posting? All associated applications will also be affected."
        confirmText="Delete"
        danger
      />
    </DashboardLayout>
  );
}
