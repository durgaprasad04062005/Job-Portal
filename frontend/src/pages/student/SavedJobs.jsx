import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { savedJobsAPI } from '../../api/jobs';
import JobCard from '../../components/jobs/JobCard';
import Pagination from '../../components/ui/Pagination';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';

export default function SavedJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchSaved = async () => {
    setLoading(true);
    try {
      const res = await savedJobsAPI.getSaved({ page, size: 12 });
      const data = res.data.data;
      setJobs(data.content);
      setTotalPages(data.totalPages);
    } catch {
      toast.error('Failed to load saved jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSaved(); }, [page]);

  return (
    <DashboardLayout title="Saved Jobs">
      <div className="section-header">
        <div>
          <h2 style={{ fontWeight: 700, fontSize: '1.25rem' }}>Saved Jobs</h2>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>Jobs you've bookmarked for later</p>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><Spinner size="xl" /></div>
      ) : jobs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Bookmark size={48} color="var(--gray-300)" /></div>
          <h3>No saved jobs</h3>
          <p>Browse jobs and save the ones you're interested in</p>
          <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/jobs')}>
            Browse Jobs
          </button>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: '1.25rem' }}>
            {jobs.map(job => (
              <JobCard key={job.id} job={job} onSaveToggle={fetchSaved} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </DashboardLayout>
  );
}
