import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, X, Save } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { jobsAPI } from '../../api/jobs';
import toast from 'react-hot-toast';
import Spinner from '../../components/ui/Spinner';

const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  requirements: z.string().optional(),
  responsibilities: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  location: z.string().min(1, 'Location is required'),
  jobType: z.string().min(1, 'Job type is required'),
  experienceLevel: z.string().optional(),
  experienceMinYears: z.coerce.number().min(0).optional(),
  experienceMaxYears: z.coerce.number().min(0).optional(),
  salaryMin: z.coerce.number().min(0).optional(),
  salaryMax: z.coerce.number().min(0).optional(),
  workMode: z.string().optional(),
  status: z.string().default('ACTIVE'),
});

const CATEGORIES = ['Software Development', 'Frontend Development', 'Backend Development', 'DevOps & Cloud', 'Data Science', 'AI & ML', 'Design', 'Product Management', 'Internship', 'Other'];

export default function PostJob() {
  const navigate = useNavigate();
  const location = useLocation();
  const editJob = location.state?.job;
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState(editJob?.skillsRequired || []);
  const [benefits, setBenefits] = useState(editJob?.benefits || []);
  const [skillInput, setSkillInput] = useState('');
  const [benefitInput, setBenefitInput] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: editJob ? {
      title: editJob.title,
      description: editJob.description,
      requirements: editJob.requirements,
      responsibilities: editJob.responsibilities,
      category: editJob.category,
      location: editJob.location,
      jobType: editJob.jobType,
      experienceLevel: editJob.experienceLevel,
      experienceMinYears: editJob.experienceMinYears,
      experienceMaxYears: editJob.experienceMaxYears,
      salaryMin: editJob.salaryMin,
      salaryMax: editJob.salaryMax,
      workMode: editJob.workMode,
      status: editJob.status,
    } : { status: 'ACTIVE' }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = { ...data, skillsRequired: skills, benefits };
      if (editJob) {
        await jobsAPI.update(editJob.id, payload);
        toast.success('Job updated successfully!');
      } else {
        await jobsAPI.create(payload);
        toast.success('Job posted successfully!');
      }
      navigate('/employer/jobs');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save job');
    } finally {
      setLoading(false);
    }
  };

  const addTag = (list, setList, input, setInput) => {
    const val = input.trim();
    if (val && !list.includes(val)) { setList([...list, val]); setInput(''); }
  };

  return (
    <DashboardLayout title={editJob ? 'Edit Job' : 'Post a Job'}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Basic info */}
          <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Job Details</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Job Title *</label>
                <input {...register('title')} className={`form-input ${errors.title ? 'error' : ''}`} placeholder="e.g. Senior React Developer" />
                {errors.title && <p className="form-error">{errors.title.message}</p>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Category *</label>
                  <select {...register('category')} className={`form-select ${errors.category ? 'error' : ''}`}>
                    <option value="">Select category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.category && <p className="form-error">{errors.category.message}</p>}
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Location *</label>
                  <input {...register('location')} className={`form-input ${errors.location ? 'error' : ''}`} placeholder="e.g. New York, NY or Remote" />
                  {errors.location && <p className="form-error">{errors.location.message}</p>}
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Job Type *</label>
                  <select {...register('jobType')} className={`form-select ${errors.jobType ? 'error' : ''}`}>
                    <option value="">Select type</option>
                    {['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'REMOTE'].map(t => (
                      <option key={t} value={t}>{t.replace('_', ' ')}</option>
                    ))}
                  </select>
                  {errors.jobType && <p className="form-error">{errors.jobType.message}</p>}
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Work Mode</label>
                  <select {...register('workMode')} className="form-select">
                    <option value="">Select mode</option>
                    {['ONSITE', 'REMOTE', 'HYBRID'].map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Experience Level</label>
                  <select {...register('experienceLevel')} className="form-select">
                    <option value="">Any level</option>
                    {['ENTRY', 'MID', 'SENIOR', 'LEAD'].map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Status</label>
                  <select {...register('status')} className="form-select">
                    <option value="ACTIVE">Active</option>
                    <option value="DRAFT">Draft</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Job Description *</label>
                <textarea {...register('description')} className={`form-textarea ${errors.description ? 'error' : ''}`} rows={6} placeholder="Describe the role, team, and what the candidate will be doing..." />
                {errors.description && <p className="form-error">{errors.description.message}</p>}
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Requirements</label>
                <textarea {...register('requirements')} className="form-textarea" rows={4} placeholder="List the required qualifications, education, and experience..." />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Responsibilities</label>
                <textarea {...register('responsibilities')} className="form-textarea" rows={4} placeholder="List the key responsibilities and day-to-day tasks..." />
              </div>
            </div>
          </div>

          {/* Salary & Experience */}
          <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Compensation & Experience</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Min Salary ($/year)</label>
                <input {...register('salaryMin')} type="number" className="form-input" placeholder="e.g. 80000" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Max Salary ($/year)</label>
                <input {...register('salaryMax')} type="number" className="form-input" placeholder="e.g. 120000" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Min Experience (years)</label>
                <input {...register('experienceMinYears')} type="number" className="form-input" placeholder="0" min="0" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Max Experience (years)</label>
                <input {...register('experienceMaxYears')} type="number" className="form-input" placeholder="10" min="0" />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Required Skills</h3>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <input type="text" className="form-input" value={skillInput} onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag(skills, setSkills, skillInput, setSkillInput))}
                placeholder="Add a required skill" />
              <button type="button" className="btn btn-secondary" onClick={() => addTag(skills, setSkills, skillInput, setSkillInput)}>
                <Plus size={16} /> Add
              </button>
            </div>
            <div className="chip-container">
              {skills.length === 0 && <span style={{ color: 'var(--gray-400)', fontSize: '0.875rem' }}>No skills added</span>}
              {skills.map(s => (
                <span key={s} className="chip">{s}
                  <button type="button" className="chip-remove" onClick={() => setSkills(skills.filter(x => x !== s))}>×</button>
                </span>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Benefits</h3>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <input type="text" className="form-input" value={benefitInput} onChange={e => setBenefitInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag(benefits, setBenefits, benefitInput, setBenefitInput))}
                placeholder="e.g. Health Insurance, 401k, Remote Work" />
              <button type="button" className="btn btn-secondary" onClick={() => addTag(benefits, setBenefits, benefitInput, setBenefitInput)}>
                <Plus size={16} /> Add
              </button>
            </div>
            <div className="chip-container">
              {benefits.length === 0 && <span style={{ color: 'var(--gray-400)', fontSize: '0.875rem' }}>No benefits added</span>}
              {benefits.map(b => (
                <span key={b} className="chip">{b}
                  <button type="button" className="chip-remove" onClick={() => setBenefits(benefits.filter(x => x !== b))}>×</button>
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary btn-lg" onClick={() => navigate('/employer/jobs')}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? <><Spinner size="sm" /> Saving...</> : <><Save size={16} /> {editJob ? 'Update Job' : 'Post Job'}</>}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
