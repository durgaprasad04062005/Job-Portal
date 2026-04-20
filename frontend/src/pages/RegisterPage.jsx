import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, ArrowRight, GraduationCap, Building2, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Spinner from '../components/ui/Spinner';
import Logo from '../components/ui/Logo';

const schema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Must contain uppercase, lowercase, and number'),
  confirmPassword: z.string(),
  role: z.enum(['STUDENT', 'EMPLOYER']),
  companyName: z.string().optional(),
  phone: z.string().optional(),
}).refine(d => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

function Field({ label, error, children }) {
  return (
    <div style={{ marginBottom:'1.125rem' }}>
      <label style={{ display:'block', fontSize:'0.8125rem', fontWeight:600, color:'#374151', marginBottom:'0.5rem' }}>{label}</label>
      {children}
      {error && <p style={{ fontSize:'0.75rem', color:'#ef4444', marginTop:'0.375rem' }}>{error}</p>}
    </div>
  );
}

const inputStyle = (hasError) => ({
  width:'100%', padding:'0.6875rem 0.875rem',
  border:`1.5px solid ${hasError ? '#f87171' : '#e2e8f0'}`,
  borderRadius:9, fontSize:'0.9375rem', color:'#0f172a',
  background:'#f8fafc', outline:'none', boxSizing:'border-box',
  transition:'border-color 0.15s, background 0.15s',
});

export default function RegisterPage() {
  const { register: authRegister } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: searchParams.get('role') || 'STUDENT' },
  });

  const role = watch('role');
  const password = watch('password') || '';

  const strengthChecks = [
    { label: '8+ characters', ok: password.length >= 8 },
    { label: 'Uppercase letter', ok: /[A-Z]/.test(password) },
    { label: 'Lowercase letter', ok: /[a-z]/.test(password) },
    { label: 'Number', ok: /\d/.test(password) },
  ];
  const strength = strengthChecks.filter(c => c.ok).length;
  const strengthColor = strength <= 1 ? '#ef4444' : strength <= 2 ? '#f59e0b' : strength <= 3 ? '#3b82f6' : '#10b981';
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const { confirmPassword, ...payload } = data;
      await authRegister(payload);
      toast.success('Account created! Please sign in.');
      navigate('/login', { state: { registeredEmail: data.email, registered: true }, replace: true });
    } catch (err) {
      if (!err.response) {
        toast.error('Cannot reach server. Is the backend running?');
      } else {
        const errData = err.response?.data;
        if (errData?.errors && typeof errData.errors === 'object') {
          toast.error(Object.values(errData.errors)[0] || errData.message || 'Registration failed');
        } else {
          toast.error(errData?.message || 'Registration failed. Please try again.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', fontFamily:'Inter, sans-serif' }}>

      {/* ── LEFT PANEL ── */}
      <div className="reg-left" style={{
        width:'40%', minHeight:'100vh',
        background:'linear-gradient(160deg, #0f172a 0%, #1e1b4b 60%, #312e81 100%)',
        display:'flex', flexDirection:'column', padding:'3rem',
        position:'relative', overflow:'hidden',
      }}>
        <div style={{ position:'absolute', top:'-100px', right:'-100px', width:350, height:350, borderRadius:'50%', background:'rgba(99,102,241,0.12)', filter:'blur(70px)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'-80px', left:'-80px', width:300, height:300, borderRadius:'50%', background:'rgba(14,165,233,0.1)', filter:'blur(60px)', pointerEvents:'none' }} />

        <Link to="/" style={{ display:'flex', alignItems:'center', gap:'0.625rem', textDecoration:'none', position:'relative', zIndex:1 }}>
          <Logo size="md" dark />
        </Link>

        <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', position:'relative', zIndex:1 }}>
          <h1 style={{ fontSize:'clamp(1.5rem,2.5vw,2.25rem)', fontWeight:800, color:'#fff', lineHeight:1.25, marginBottom:'1rem', letterSpacing:'-0.03em' }}>
            Start your career<br />journey today
          </h1>
          <p style={{ color:'rgba(255,255,255,0.55)', fontSize:'0.9375rem', lineHeight:1.75, maxWidth:300, marginBottom:'2.5rem' }}>
            Join over 200,000 professionals who found their dream jobs through JobPortal.
          </p>

          {/* Stats */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'2.5rem' }}>
            {[
              { value:'50K+', label:'Active Jobs' },
              { value:'10K+', label:'Companies' },
              { value:'200K+', label:'Job Seekers' },
              { value:'95%', label:'Success Rate' },
            ].map(s => (
              <div key={s.label} style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, padding:'1rem' }}>
                <div style={{ fontSize:'1.375rem', fontWeight:800, color:'#fff', letterSpacing:'-0.02em' }}>{s.value}</div>
                <div style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.5)', marginTop:'0.2rem' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Perks */}
          <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
            {['Free to use for job seekers', 'Verified employer profiles', 'Resume upload & management', 'Real-time notifications'].map(p => (
              <div key={p} style={{ display:'flex', alignItems:'center', gap:'0.625rem' }}>
                <div style={{ width:18, height:18, borderRadius:'50%', background:'rgba(99,102,241,0.3)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Check size={10} color="#a5b4fc" strokeWidth={3} />
                </div>
                <span style={{ color:'rgba(255,255,255,0.65)', fontSize:'0.875rem' }}>{p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', background:'#fafafa', padding:'2rem', overflowY:'auto' }}>
        <div style={{ width:'100%', maxWidth:440, paddingTop:'1rem', paddingBottom:'1rem' }}>

          <div style={{ marginBottom:'1.75rem' }}>
            <Link to="/" style={{ display:'inline-flex', marginBottom:'1.25rem', textDecoration:'none' }}>
              <Logo size="md" />
            </Link>
            <h2 style={{ fontSize:'1.625rem', fontWeight:800, color:'#0f172a', letterSpacing:'-0.03em', marginBottom:'0.375rem' }}>Create your account</h2>
            <p style={{ color:'#64748b', fontSize:'0.9375rem' }}>Fill in the details below to get started</p>
          </div>

          <div style={{ background:'#fff', borderRadius:16, border:'1px solid #e2e8f0', boxShadow:'0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)', padding:'2rem' }}>

            {/* Role selector */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem', marginBottom:'1.5rem' }}>
              {[
                { value:'STUDENT', Icon: GraduationCap, label:'Job Seeker', desc:'Find your dream job' },
                { value:'EMPLOYER', Icon: Building2, label:'Employer', desc:'Hire top talent' },
              ].map(({ value, Icon, label, desc }) => {
                const active = role === value;
                return (
                  <label key={value} style={{
                    border:`2px solid ${active ? '#6366f1' : '#e2e8f0'}`,
                    borderRadius:10, padding:'0.875rem',
                    cursor:'pointer', textAlign:'center',
                    background: active ? '#eef2ff' : '#f8fafc',
                    transition:'all 0.15s',
                  }}>
                    <input type="radio" {...register('role')} value={value} style={{ display:'none' }} />
                    <Icon size={20} color={active ? '#6366f1' : '#94a3b8'} style={{ margin:'0 auto 0.375rem' }} />
                    <div style={{ fontWeight:700, fontSize:'0.875rem', color: active ? '#4338ca' : '#374151' }}>{label}</div>
                    <div style={{ fontSize:'0.7rem', color: active ? '#6366f1' : '#94a3b8', marginTop:'0.125rem' }}>{desc}</div>
                  </label>
                );
              })}
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Field label="Full Name" error={errors.fullName?.message}>
                <input {...register('fullName')} placeholder="John Doe" style={inputStyle(!!errors.fullName)}
                  onFocus={e => { e.target.style.borderColor='#6366f1'; e.target.style.background='#fff'; }}
                  onBlur={e => { e.target.style.borderColor=errors.fullName?'#f87171':'#e2e8f0'; e.target.style.background='#f8fafc'; }} />
              </Field>

              <Field label="Email Address" error={errors.email?.message}>
                <input {...register('email')} type="email" placeholder="you@example.com" style={inputStyle(!!errors.email)}
                  onFocus={e => { e.target.style.borderColor='#6366f1'; e.target.style.background='#fff'; }}
                  onBlur={e => { e.target.style.borderColor=errors.email?'#f87171':'#e2e8f0'; e.target.style.background='#f8fafc'; }} />
              </Field>

              {role === 'EMPLOYER' && (
                <Field label="Company Name" error={errors.companyName?.message}>
                  <input {...register('companyName')} placeholder="Acme Corp" style={inputStyle(false)}
                    onFocus={e => { e.target.style.borderColor='#6366f1'; e.target.style.background='#fff'; }}
                    onBlur={e => { e.target.style.borderColor='#e2e8f0'; e.target.style.background='#f8fafc'; }} />
                </Field>
              )}

              <Field label="Phone (optional)">
                <input {...register('phone')} type="tel" placeholder="+1 (555) 000-0000" style={inputStyle(false)}
                  onFocus={e => { e.target.style.borderColor='#6366f1'; e.target.style.background='#fff'; }}
                  onBlur={e => { e.target.style.borderColor='#e2e8f0'; e.target.style.background='#f8fafc'; }} />
              </Field>

              <Field label="Password" error={errors.password?.message}>
                <div style={{ position:'relative' }}>
                  <input {...register('password')} type={showPw ? 'text' : 'password'}
                    placeholder="Min 8 chars, uppercase, number"
                    style={{ ...inputStyle(!!errors.password), paddingRight:'2.75rem' }}
                    onFocus={e => { e.target.style.borderColor='#6366f1'; e.target.style.background='#fff'; }}
                    onBlur={e => { e.target.style.borderColor=errors.password?'#f87171':'#e2e8f0'; e.target.style.background='#f8fafc'; }} />
                  <button type="button" onClick={() => setShowPw(v => !v)} tabIndex={-1}
                    style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'#94a3b8', cursor:'pointer', padding:0, display:'flex' }}>
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {/* Strength meter */}
                {password.length > 0 && (
                  <div style={{ marginTop:'0.625rem' }}>
                    <div style={{ display:'flex', gap:'3px', marginBottom:'0.375rem' }}>
                      {[1,2,3,4].map(i => (
                        <div key={i} style={{ flex:1, height:3, borderRadius:9999, background: i <= strength ? strengthColor : '#e2e8f0', transition:'background 0.2s' }} />
                      ))}
                    </div>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <div style={{ display:'flex', gap:'0.75rem' }}>
                        {strengthChecks.map(c => (
                          <span key={c.label} style={{ fontSize:'0.6875rem', color: c.ok ? '#10b981' : '#94a3b8', display:'flex', alignItems:'center', gap:'0.2rem' }}>
                            {c.ok ? '✓' : '○'} {c.label}
                          </span>
                        ))}
                      </div>
                      <span style={{ fontSize:'0.6875rem', fontWeight:700, color: strengthColor }}>{strengthLabel}</span>
                    </div>
                  </div>
                )}
              </Field>

              <Field label="Confirm Password" error={errors.confirmPassword?.message}>
                <input {...register('confirmPassword')} type="password" placeholder="••••••••" style={inputStyle(!!errors.confirmPassword)}
                  onFocus={e => { e.target.style.borderColor='#6366f1'; e.target.style.background='#fff'; }}
                  onBlur={e => { e.target.style.borderColor=errors.confirmPassword?'#f87171':'#e2e8f0'; e.target.style.background='#f8fafc'; }} />
              </Field>

              <button type="submit" disabled={loading} style={{
                width:'100%', padding:'0.8125rem',
                background: loading ? '#a5b4fc' : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                color:'#fff', border:'none', borderRadius:9,
                fontSize:'0.9375rem', fontWeight:700, cursor: loading ? 'not-allowed' : 'pointer',
                display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem',
                boxShadow: loading ? 'none' : '0 4px 14px rgba(99,102,241,0.35)',
                transition:'all 0.2s', marginTop:'0.25rem',
              }}>
                {loading ? <><Spinner size="sm" /> Creating account...</> : <>Create Account <ArrowRight size={16} /></>}
              </button>
            </form>
          </div>

          <p style={{ textAlign:'center', marginTop:'1.5rem', fontSize:'0.875rem', color:'#64748b' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color:'#6366f1', fontWeight:700, textDecoration:'none' }}>Sign in →</Link>
          </p>
          <p style={{ textAlign:'center', marginTop:'0.75rem' }}>
            <Link to="/" style={{ fontSize:'0.8125rem', color:'#94a3b8', textDecoration:'none' }}>← Back to home</Link>
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .reg-left { display: none !important; } }
      `}</style>
    </div>
  );
}
