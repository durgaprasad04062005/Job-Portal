import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Briefcase, Users, Calendar, ArrowLeft, Bookmark, BookmarkCheck, Send, Building } from 'lucide-react';
import { jobsAPI, applicationsAPI, savedJobsAPI } from '../api/jobs';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/ui/Modal';
import Spinner from '../components/ui/Spinner';
import toast from 'react-hot-toast';
import Logo from '../components/ui/Logo';

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await jobsAPI.getById(id);
        setJob(res.data.data);
      } catch {
        toast.error('Job not found');
        navigate('/jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleSave = async () => {
    if (!user) { navigate('/login'); return; }
    setSaving(true);
    try {
      if (job.saved) {
        await savedJobsAPI.unsave(id);
        setJob(prev => ({ ...prev, saved: false }));
        toast.success('Removed from saved jobs');
      } else {
        await savedJobsAPI.save(id);
        setJob(prev => ({ ...prev, saved: true }));
        toast.success('Job saved!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setSaving(false);
    }
  };

  const handleApply = async () => {
    setApplying(true);
    try {
      await applicationsAPI.apply({ jobId: id, coverLetter, useProfileResume: !resumeFile }, resumeFile);
      setJob(prev => ({ ...prev, applied: true }));
      setShowApplyModal(false);
      toast.success('Application submitted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Spinner size="xl" />
    </div>
  );

  if (!job) return null;

  const formatSalary = () => {
    if (!job.salaryMin && !job.salaryMax) return 'Not disclosed';
    const fmt = n => n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`;
    if (job.salaryMin && job.salaryMax) return `${fmt(job.salaryMin)} - ${fmt(job.salaryMax)} / year`;
    return job.salaryMin ? `From ${fmt(job.salaryMin)}` : `Up to ${fmt(job.salaryMax)}`;
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gray-50)' }}>
      {/* Topbar */}
      <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--gray-200)', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', position: 'sticky', top: 0, zIndex: 50 }}>
        <button className="btn btn-icon btn-secondary" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
        </button>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Logo size="sm" />
        </Link>
      </div>

      <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: 900 }}>
        {/* Job header card */}
        <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div className="company-logo" style={{ width: 72, height: 72, fontSize: '2rem' }}>
              {job.companyLogoUrl
                ? <img src={job.companyLogoUrl} alt={job.companyName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : job.companyName?.[0]?.toUpperCase()
              }
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.375rem' }}>{job.title}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gray-500)', marginBottom: '1rem' }}>
                <Building size={15} />
                <span style={{ fontWeight: 500 }}>{job.companyName}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                  <MapPin size={14} /> {job.location}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                  <Briefcase size={14} /> {job.jobType?.replace('_', ' ')}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: 'var(--success)', fontWeight: 600 }}>
                  <DollarSign size={14} /> {formatSalary()}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                  <Users size={14} /> {job.applicationCount} applicants
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexShrink: 0 }}>
              {user?.role === 'STUDENT' && (
                <button className="btn btn-secondary" onClick={handleSave} disabled={saving}>
                  {job.saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                  {job.saved ? 'Saved' : 'Save'}
                </button>
              )}
              {user?.role === 'STUDENT' && (
                <button
                  className={`btn ${job.applied ? 'btn-secondary' : 'btn-primary'}`}
                  onClick={() => !job.applied && setShowApplyModal(true)}
                  disabled={job.applied}
                >
                  <Send size={16} />
                  {job.applied ? 'Applied' : 'Apply Now'}
                </button>
              )}
              {!user && (
                <button className="btn btn-primary" onClick={() => navigate('/login')}>
                  <Send size={16} /> Apply Now
                </button>
              )}
            </div>
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--gray-100)' }}>
            {job.experienceLevel && <span className="badge badge-primary">{job.experienceLevel} Level</span>}
            {job.workMode && <span className="badge badge-blue">{job.workMode}</span>}
            {job.deadline && (
              <span className="badge badge-warning" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Calendar size={11} /> Deadline: {new Date(job.deadline).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem' }}>
          {/* Main content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {job.description && (
              <div className="card" style={{ padding: '1.5rem' }}>
                <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>Job Description</h2>
                <p style={{ color: 'var(--gray-600)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{job.description}</p>
              </div>
            )}
            {job.requirements && (
              <div className="card" style={{ padding: '1.5rem' }}>
                <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>Requirements</h2>
                <p style={{ color: 'var(--gray-600)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{job.requirements}</p>
              </div>
            )}
            {job.responsibilities && (
              <div className="card" style={{ padding: '1.5rem' }}>
                <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>Responsibilities</h2>
                <p style={{ color: 'var(--gray-600)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{job.responsibilities}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Skills */}
            {job.skillsRequired?.length > 0 && (
              <div className="card" style={{ padding: '1.25rem' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '0.875rem', fontSize: '0.9375rem' }}>Required Skills</h3>
                <div className="job-skills">
                  {job.skillsRequired.map(skill => (
                    <span key={skill} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Benefits */}
            {job.benefits?.length > 0 && (
              <div className="card" style={{ padding: '1.25rem' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '0.875rem', fontSize: '0.9375rem' }}>Benefits</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {job.benefits.map(b => (
                    <div key={b} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                      <span style={{ color: 'var(--success)' }}>✓</span> {b}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Job overview */}
            <div className="card" style={{ padding: '1.25rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '0.875rem', fontSize: '0.9375rem' }}>Job Overview</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { label: 'Experience', value: job.experienceMinYears || job.experienceMaxYears ? `${job.experienceMinYears}-${job.experienceMaxYears} years` : 'Not specified' },
                  { label: 'Category', value: job.category },
                  { label: 'Views', value: `${job.viewCount} views` },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--gray-500)' }}>{item.label}</span>
                    <span style={{ fontWeight: 500, color: 'var(--gray-700)' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <Modal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        title={`Apply for ${job.title}`}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowApplyModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleApply} disabled={applying}>
              {applying ? <><Spinner size="sm" /> Submitting...</> : <><Send size={15} /> Submit Application</>}
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ background: 'var(--gray-50)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
              Applying for <strong>{job.title}</strong> at <strong>{job.companyName}</strong>
            </p>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Cover Letter (optional)</label>
            <textarea
              className="form-textarea"
              value={coverLetter}
              onChange={e => setCoverLetter(e.target.value)}
              placeholder="Tell the employer why you're a great fit for this role..."
              rows={5}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Resume (optional — uses profile resume if not uploaded)</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={e => setResumeFile(e.target.files[0])}
              className="form-input"
              style={{ padding: '0.5rem' }}
            />
            {resumeFile && <p style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: '0.25rem' }}>✓ {resumeFile.name}</p>}
          </div>
        </div>
      </Modal>
    </div>
  );
}
