import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Upload, Plus, Trash2, Save, FileText } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { profileAPI } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import Spinner from '../../components/ui/Spinner';

export default function StudentProfile() {
  const { user, updateUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [skills, setSkills] = useState(user?.skills || []);
  const [skillInput, setSkillInput] = useState('');
  const [resumeFile, setResumeFile] = useState(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      fullName: user?.fullName || '',
      phone: user?.phone || '',
      location: user?.location || '',
      profileSummary: user?.profileSummary || '',
    }
  });

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) {
      setSkills([...skills, s]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => setSkills(skills.filter(s => s !== skill));

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const res = await profileAPI.update({ ...data, skills });
      updateUser(res.data.data);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) return;
    setUploadingResume(true);
    try {
      const res = await profileAPI.uploadResume(resumeFile);
      updateUser(res.data.data);
      setResumeFile(null);
      toast.success('Resume uploaded successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload resume');
    } finally {
      setUploadingResume(false);
    }
  };

  return (
    <DashboardLayout title="My Profile">
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        {/* Profile completeness */}
        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h3 style={{ fontWeight: 700 }}>Profile Completeness</h3>
            <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.125rem' }}>{user?.profileCompleteness}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${user?.profileCompleteness}%` }} />
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', marginTop: '0.5rem' }}>
            Complete your profile to get better job recommendations
          </p>
        </div>

        {/* Resume upload */}
        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Resume</h3>
          {user?.resumeOriginalName && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem', background: 'var(--gray-50)', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }}>
              <FileText size={20} color="var(--primary)" />
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 500, fontSize: '0.875rem' }}>{user.resumeOriginalName}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>Current resume</p>
              </div>
              <a href={user.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                View
              </a>
            </div>
          )}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label className="form-label">Upload New Resume (PDF, DOC, DOCX — max 5MB)</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={e => setResumeFile(e.target.files[0])}
                className="form-input"
                style={{ padding: '0.5rem' }}
              />
              {resumeFile && <p style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: '0.25rem' }}>✓ {resumeFile.name}</p>}
            </div>
            <button
              className="btn btn-primary"
              onClick={handleResumeUpload}
              disabled={!resumeFile || uploadingResume}
            >
              {uploadingResume ? <><Spinner size="sm" /> Uploading...</> : <><Upload size={15} /> Upload</>}
            </button>
          </div>
        </div>

        {/* Profile form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Personal Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Full Name</label>
                <input {...register('fullName', { required: 'Name is required' })} className={`form-input ${errors.fullName ? 'error' : ''}`} />
                {errors.fullName && <p className="form-error">{errors.fullName.message}</p>}
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Phone</label>
                <input {...register('phone')} className="form-input" placeholder="+1 (555) 000-0000" />
              </div>
              <div className="form-group" style={{ marginBottom: 0, gridColumn: '1 / -1' }}>
                <label className="form-label">Location</label>
                <input {...register('location')} className="form-input" placeholder="City, State/Country" />
              </div>
              <div className="form-group" style={{ marginBottom: 0, gridColumn: '1 / -1' }}>
                <label className="form-label">Profile Summary</label>
                <textarea {...register('profileSummary')} className="form-textarea" rows={4} placeholder="Tell employers about yourself, your experience, and what you're looking for..." />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Skills</h3>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <input
                type="text"
                className="form-input"
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                placeholder="Add a skill (e.g. React, Java, Python)"
              />
              <button type="button" className="btn btn-secondary" onClick={addSkill}>
                <Plus size={16} /> Add
              </button>
            </div>
            <div className="chip-container">
              {skills.length === 0 && <span style={{ color: 'var(--gray-400)', fontSize: '0.875rem' }}>No skills added yet</span>}
              {skills.map(skill => (
                <span key={skill} className="chip">
                  {skill}
                  <button type="button" className="chip-remove" onClick={() => removeSkill(skill)}>×</button>
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
              {saving ? <><Spinner size="sm" /> Saving...</> : <><Save size={16} /> Save Profile</>}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
