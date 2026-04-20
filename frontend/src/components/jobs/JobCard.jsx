import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Briefcase, Bookmark, BookmarkCheck } from 'lucide-react';
import { savedJobsAPI } from '../../api/jobs';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { useState } from 'react';

const JOB_TYPE_COLORS = {
  FULL_TIME:   { bg: '#d1fae5', color: '#065f46' },
  PART_TIME:   { bg: '#fef3c7', color: '#92400e' },
  CONTRACT:    { bg: '#dbeafe', color: '#1e40af' },
  INTERNSHIP:  { bg: '#ede9fe', color: '#5b21b6' },
  REMOTE:      { bg: '#f3f4f6', color: '#374151' },
};

export default function JobCard({ job, onSaveToggle }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(job.saved);

  const handleSave = async (e) => {
    e.stopPropagation();
    if (!user) { navigate('/login'); return; }
    if (user.role !== 'STUDENT') return;
    setSaving(true);
    try {
      if (saved) {
        await savedJobsAPI.unsave(job.id);
        setSaved(false);
        toast.success('Removed from saved jobs');
      } else {
        await savedJobsAPI.save(job.id);
        setSaved(true);
        toast.success('Job saved!');
      }
      onSaveToggle?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update saved jobs');
    } finally {
      setSaving(false);
    }
  };

  const formatSalary = () => {
    const min = job.salaryMin;
    const max = job.salaryMax;
    if (!min && !max) return null;
    const fmt = (n) => n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`;
    if (min && max) return `${fmt(min)} – ${fmt(max)}`;
    if (min) return `From ${fmt(min)}`;
    return `Up to ${fmt(max)}`;
  };

  const timeAgo = (date) => {
    if (!date) return '';
    const days = Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    return `${Math.floor(days / 30)}mo ago`;
  };

  const typeStyle = JOB_TYPE_COLORS[job.jobType] || { bg: '#f3f4f6', color: '#374151' };
  const typeLabel = job.jobType?.replace('_', ' ') || '';

  return (
    <div className="job-card" onClick={() => navigate(`/jobs/${job.id}`)}>

      {/* ── Header: logo + title + badge ── */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>

        {/* Company logo */}
        <div className="company-logo">
          {job.companyLogoUrl
            ? <img src={job.companyLogoUrl} alt={job.companyName}
                   style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : (job.companyName?.[0]?.toUpperCase() || '?')
          }
        </div>

        {/* Title + company — takes remaining space, truncates */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="job-title">{job.title}</div>
          <div className="job-company">{job.companyName}</div>
        </div>

        {/* Badge + bookmark — fixed width, no shrink */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
                      gap: '0.375rem', flexShrink: 0 }}>
          <span style={{
            padding: '0.2rem 0.55rem',
            borderRadius: 9999,
            fontSize: '0.7rem',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            background: typeStyle.bg,
            color: typeStyle.color,
          }}>
            {typeLabel}
          </span>

          {user?.role === 'STUDENT' && (
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: '2px',
                color: saved ? 'var(--primary)' : 'var(--gray-300)',
                transition: 'color 0.2s',
              }}
              title={saved ? 'Remove from saved' : 'Save job'}
            >
              {saved ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}
            </button>
          )}
        </div>
      </div>

      {/* ── Meta row ── */}
      <div className="job-meta" style={{ marginTop: '0.75rem' }}>
        {job.location && (
          <span className="job-meta-item">
            <MapPin size={12} />{job.location}
          </span>
        )}
        {job.experienceLevel && (
          <span className="job-meta-item">
            <Briefcase size={12} />{job.experienceLevel}
          </span>
        )}
        <span className="job-meta-item">
          <Clock size={12} />{timeAgo(job.createdAt)}
        </span>
        {job.workMode && (
          <span style={{
            padding: '0.15rem 0.5rem',
            background: 'var(--gray-100)',
            color: 'var(--gray-600)',
            borderRadius: 9999,
            fontSize: '0.7rem',
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}>
            {job.workMode}
          </span>
        )}
      </div>

      {/* ── Skills ── */}
      {job.skillsRequired?.length > 0 && (
        <div className="job-skills" style={{ marginTop: '0.625rem' }}>
          {job.skillsRequired.slice(0, 4).map(skill => (
            <span key={skill} className="skill-tag">{skill}</span>
          ))}
          {job.skillsRequired.length > 4 && (
            <span className="skill-tag">+{job.skillsRequired.length - 4}</span>
          )}
        </div>
      )}

      {/* ── Footer: salary + applicants ── */}
      <div className="job-footer">
        <span className="job-salary">
          {formatSalary() || <span style={{ color: 'var(--gray-400)', fontWeight: 400 }}>Salary not disclosed</span>}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {job.applied && (
            <span style={{
              padding: '0.15rem 0.55rem',
              background: '#d1fae5', color: '#065f46',
              borderRadius: 9999, fontSize: '0.7rem', fontWeight: 700,
            }}>
              Applied ✓
            </span>
          )}
          <span style={{ fontSize: '0.7rem', color: 'var(--gray-400)', whiteSpace: 'nowrap' }}>
            {job.applicationCount ?? 0} applicants
          </span>
        </div>
      </div>
    </div>
  );
}
