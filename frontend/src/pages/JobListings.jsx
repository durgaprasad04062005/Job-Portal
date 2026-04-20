import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, X, SlidersHorizontal, Briefcase } from 'lucide-react';
import { jobsAPI } from '../api/jobs';
import JobCard from '../components/jobs/JobCard';
import Pagination from '../components/ui/Pagination';
import Spinner from '../components/ui/Spinner';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/ui/Logo';

const CATEGORIES = ['Software Development', 'Frontend Development', 'Backend Development', 'DevOps & Cloud', 'Data Science', 'AI & ML', 'Design', 'Product Management', 'Internship'];
const JOB_TYPES = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'REMOTE'];
const EXP_LEVELS = ['ENTRY', 'MID', 'SENIOR', 'LEAD'];
const WORK_MODES = ['ONSITE', 'REMOTE', 'HYBRID'];

export default function JobListings() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    category: searchParams.get('category') || '',
    location: searchParams.get('location') || '',
    jobType: '',
    experienceLevel: '',
    workMode: '',
    salaryMin: '',
    salaryMax: '',
    page: 0,
    size: 12,
  });

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      Object.entries(filters).forEach(([k, v]) => { if (v !== '' && v !== null) params[k] = v; });
      const res = await jobsAPI.search(params);
      const data = res.data.data;
      setJobs(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 0 }));
  };

  const clearFilters = () => {
    setFilters({ keyword: '', category: '', location: '', jobType: '', experienceLevel: '', workMode: '', salaryMin: '', salaryMax: '', page: 0, size: 12 });
  };

  const activeFilterCount = [filters.category, filters.jobType, filters.experienceLevel, filters.workMode, filters.salaryMin, filters.salaryMax].filter(Boolean).length;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gray-50)' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #312e81 100%)', padding: '3rem 1.5rem 2rem' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Logo size="sm" dark />
            </Link>
            {user ? (
              <Link to={user.role === 'STUDENT' ? '/student/dashboard' : '/employer/dashboard'} className="btn btn-outline" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>
                Dashboard
              </Link>
            ) : (
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Link to="/login" className="btn btn-secondary btn-sm">Sign In</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
              </div>
            )}
          </div>

          <h1 style={{ color: '#fff', fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem' }}>
            Find Your Perfect Job
          </h1>

          {/* Search bar */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div className="search-bar" style={{ flex: 1, minWidth: 200, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
              <Search size={16} style={{ color: 'rgba(255,255,255,0.6)', flexShrink: 0 }} />
              <input
                value={filters.keyword}
                onChange={e => updateFilter('keyword', e.target.value)}
                placeholder="Job title, skills, company..."
                style={{ color: '#fff', background: 'transparent' }}
              />
              {filters.keyword && (
                <button onClick={() => updateFilter('keyword', '')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>
                  <X size={14} />
                </button>
              )}
            </div>
            <div className="search-bar" style={{ minWidth: 160, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
              <input
                value={filters.location}
                onChange={e => updateFilter('location', e.target.value)}
                placeholder="Location..."
                style={{ color: '#fff', background: 'transparent' }}
              />
            </div>
            <button
              className="btn btn-secondary"
              onClick={() => setShowFilters(!showFilters)}
              style={{ position: 'relative' }}
            >
              <SlidersHorizontal size={16} />
              Filters
              {activeFilterCount > 0 && (
                <span style={{ position: 'absolute', top: -6, right: -6, width: 18, height: 18, background: 'var(--danger)', color: '#fff', borderRadius: '50%', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        {/* Filter panel */}
        {showFilters && (
          <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontWeight: 700 }}>Filters</h3>
              <button className="btn btn-secondary btn-sm" onClick={clearFilters}>Clear All</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
              <div>
                <label className="form-label">Category</label>
                <select className="form-select" value={filters.category} onChange={e => updateFilter('category', e.target.value)}>
                  <option value="">All Categories</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Job Type</label>
                <select className="form-select" value={filters.jobType} onChange={e => updateFilter('jobType', e.target.value)}>
                  <option value="">All Types</option>
                  {JOB_TYPES.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Experience Level</label>
                <select className="form-select" value={filters.experienceLevel} onChange={e => updateFilter('experienceLevel', e.target.value)}>
                  <option value="">All Levels</option>
                  {EXP_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Work Mode</label>
                <select className="form-select" value={filters.workMode} onChange={e => updateFilter('workMode', e.target.value)}>
                  <option value="">All Modes</option>
                  {WORK_MODES.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Min Salary ($)</label>
                <input type="number" className="form-input" value={filters.salaryMin} onChange={e => updateFilter('salaryMin', e.target.value)} placeholder="e.g. 50000" />
              </div>
              <div>
                <label className="form-label">Max Salary ($)</label>
                <input type="number" className="form-input" value={filters.salaryMax} onChange={e => updateFilter('salaryMax', e.target.value)} placeholder="e.g. 150000" />
              </div>
            </div>
          </div>
        )}

        {/* Results header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <p style={{ color: 'var(--gray-600)', fontSize: '0.9375rem' }}>
            {loading ? 'Loading...' : <><strong>{totalElements}</strong> jobs found</>}
          </p>
          <select className="form-select" style={{ width: 'auto' }} onChange={e => setFilters(prev => ({ ...prev, size: parseInt(e.target.value), page: 0 }))}>
            <option value="12">12 per page</option>
            <option value="24">24 per page</option>
            <option value="48">48 per page</option>
          </select>
        </div>

        {/* Job grid */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
            <Spinner size="xl" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><Briefcase size={48} color="var(--gray-300)" /></div>
            <h3>No jobs found</h3>
            <p>Try adjusting your search filters</p>
            <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={clearFilters}>Clear Filters</button>
          </div>
        ) : (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
              gap: '1.25rem',
            }}>
              {jobs.map(job => (
                <JobCard key={job.id} job={job} onSaveToggle={fetchJobs} />
              ))}
            </div>
            <Pagination
              page={filters.page}
              totalPages={totalPages}
              onPageChange={p => setFilters(prev => ({ ...prev, page: p }))}
            />
          </>
        )}
      </div>
    </div>
  );
}
