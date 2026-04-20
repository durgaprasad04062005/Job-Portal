import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, ArrowRight, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Spinner from '../components/ui/Spinner';
import Logo from '../components/ui/Logo';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const DEMO_ACCOUNTS = [
  { label: 'Job Seeker', email: 'student@example.com', password: 'Student@123', color: '#6366f1', bg: '#eef2ff' },
  { label: 'Employer',  email: 'employer@techcorp.com', password: 'Employer@123', color: '#0284c7', bg: '#e0f2fe' },
  { label: 'Admin',     email: 'admin@jobportal.com',  password: 'Admin@123',    color: '#d97706', bg: '#fef3c7' },
];

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const fromAdmin     = location.state?.from === 'admin';
  const justRegistered = location.state?.registered === true;
  const registeredEmail = location.state?.registeredEmail || '';

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: registeredEmail, password: '' },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const user = await login(data);
      toast.success(`Welcome back, ${user.fullName}!`);
      if (user.role === 'STUDENT')       navigate('/student/dashboard');
      else if (user.role === 'EMPLOYER') navigate('/employer/dashboard');
      else                               navigate('/admin/dashboard');
    } catch (err) {
      if (!err.response) toast.error('Cannot reach server. Is the backend running?');
      else toast.error(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'Inter, sans-serif' }}>

      {/* ── LEFT PANEL ── */}
      <div className="login-left" style={{
        width: '45%', minHeight: '100vh',
        background: 'linear-gradient(160deg, #0f172a 0%, #1e1b4b 60%, #312e81 100%)',
        display: 'flex', flexDirection: 'column',
        padding: '3rem', position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative blobs */}
        <div style={{ position:'absolute', top:'-80px', right:'-80px', width:320, height:320, borderRadius:'50%', background:'rgba(99,102,241,0.15)', filter:'blur(60px)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'-60px', left:'-60px', width:260, height:260, borderRadius:'50%', background:'rgba(14,165,233,0.12)', filter:'blur(50px)', pointerEvents:'none' }} />

        {/* Logo */}
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:'0.625rem', textDecoration:'none', position:'relative', zIndex:1 }}>
          <Logo size="md" dark />
        </Link>

        {/* Main copy */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', position:'relative', zIndex:1 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', background:'rgba(99,102,241,0.2)', border:'1px solid rgba(99,102,241,0.3)', borderRadius:9999, padding:'0.3rem 0.875rem', marginBottom:'1.75rem', width:'fit-content' }}>
            <Zap size={13} color="#818cf8" />
            <span style={{ fontSize:'0.75rem', color:'#a5b4fc', fontWeight:600, letterSpacing:'0.04em' }}>TRUSTED BY 200K+ PROFESSIONALS</span>
          </div>

          <h1 style={{ fontSize:'clamp(1.75rem,3vw,2.5rem)', fontWeight:800, color:'#fff', lineHeight:1.2, marginBottom:'1rem', letterSpacing:'-0.03em' }}>
            Your next great<br />opportunity awaits
          </h1>
          <p style={{ color:'rgba(255,255,255,0.55)', fontSize:'1rem', lineHeight:1.75, maxWidth:340, marginBottom:'2.5rem' }}>
            Sign in to access thousands of job listings, track your applications, and connect with top employers.
          </p>

          {/* Feature list */}
          <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            {[
              { icon:'✦', text:'Smart job matching based on your skills' },
              { icon:'✦', text:'One-click apply with saved profile' },
              { icon:'✦', text:'Real-time application status updates' },
            ].map(f => (
              <div key={f.text} style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                <span style={{ color:'#818cf8', fontSize:'0.625rem' }}>{f.icon}</span>
                <span style={{ color:'rgba(255,255,255,0.65)', fontSize:'0.9rem' }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom testimonial */}
        <div style={{ position:'relative', zIndex:1, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:14, padding:'1.25rem' }}>
          <p style={{ color:'rgba(255,255,255,0.75)', fontSize:'0.875rem', lineHeight:1.7, marginBottom:'0.875rem', fontStyle:'italic' }}>
            "Found my dream job within 2 weeks. The platform made the whole process seamless."
          </p>
          <div style={{ display:'flex', alignItems:'center', gap:'0.625rem' }}>
            <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#6366f1,#a78bfa)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.875rem', fontWeight:700, color:'#fff' }}>S</div>
            <div>
              <div style={{ color:'#fff', fontSize:'0.8125rem', fontWeight:600 }}>Sarah Chen</div>
              <div style={{ color:'rgba(255,255,255,0.45)', fontSize:'0.75rem' }}>Software Engineer at Google</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', background:'#fafafa', padding:'2rem' }}>
        <div style={{ width:'100%', maxWidth:420 }}>

          {/* Banners */}
          {fromAdmin && (
            <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', background:'#fffbeb', border:'1px solid #fde68a', borderRadius:10, padding:'0.875rem 1rem', marginBottom:'1.5rem' }}>
              <span style={{ fontSize:'1rem' }}>🔒</span>
              <p style={{ fontSize:'0.8125rem', color:'#92400e', margin:0, fontWeight:500 }}>Admin area is restricted. Sign in with an admin account.</p>
            </div>
          )}
          {justRegistered && (
            <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:10, padding:'0.875rem 1rem', marginBottom:'1.5rem' }}>
              <span style={{ fontSize:'1rem' }}>🎉</span>
              <p style={{ fontSize:'0.8125rem', color:'#166534', margin:0, fontWeight:500 }}>Account created! Sign in with your credentials below.</p>
            </div>
          )}

          {/* Heading */}
          <div style={{ marginBottom:'2rem' }}>
            <Link to="/" style={{ display:'inline-flex', marginBottom:'1.5rem', textDecoration:'none' }}>
              <Logo size="md" />
            </Link>
            <h2 style={{ fontSize:'1.625rem', fontWeight:800, color:'#0f172a', letterSpacing:'-0.03em', marginBottom:'0.375rem' }}>Welcome back</h2>
            <p style={{ color:'#64748b', fontSize:'0.9375rem' }}>Sign in to your account to continue</p>
          </div>

          {/* Form card */}
          <div style={{ background:'#fff', borderRadius:16, border:'1px solid #e2e8f0', boxShadow:'0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)', padding:'2rem' }}>
            <form onSubmit={handleSubmit(onSubmit)}>

              {/* Email */}
              <div style={{ marginBottom:'1.125rem' }}>
                <label style={{ display:'block', fontSize:'0.8125rem', fontWeight:600, color:'#374151', marginBottom:'0.5rem' }}>Email address</label>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  style={{
                    width:'100%', padding:'0.6875rem 0.875rem',
                    border:`1.5px solid ${errors.email ? '#f87171' : '#e2e8f0'}`,
                    borderRadius:9, fontSize:'0.9375rem', color:'#0f172a',
                    background:'#f8fafc', outline:'none', transition:'border-color 0.15s',
                    boxSizing:'border-box',
                  }}
                  onFocus={e => { if (!errors.email) e.target.style.borderColor = '#6366f1'; e.target.style.background = '#fff'; }}
                  onBlur={e => { if (!errors.email) e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
                />
                {errors.email && <p style={{ fontSize:'0.75rem', color:'#ef4444', marginTop:'0.375rem' }}>{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div style={{ marginBottom:'1.5rem' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.5rem' }}>
                  <label style={{ fontSize:'0.8125rem', fontWeight:600, color:'#374151' }}>Password</label>
                  <Link to="/forgot-password" style={{ fontSize:'0.8125rem', color:'#6366f1', fontWeight:500, textDecoration:'none' }}>Forgot password?</Link>
                </div>
                <div style={{ position:'relative' }}>
                  <input
                    {...register('password')}
                    type={showPw ? 'text' : 'password'}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    style={{
                      width:'100%', padding:'0.6875rem 2.75rem 0.6875rem 0.875rem',
                      border:`1.5px solid ${errors.password ? '#f87171' : '#e2e8f0'}`,
                      borderRadius:9, fontSize:'0.9375rem', color:'#0f172a',
                      background:'#f8fafc', outline:'none', transition:'border-color 0.15s',
                      boxSizing:'border-box',
                    }}
                    onFocus={e => { if (!errors.password) e.target.style.borderColor = '#6366f1'; e.target.style.background = '#fff'; }}
                    onBlur={e => { if (!errors.password) e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
                  />
                  <button type="button" onClick={() => setShowPw(v => !v)} tabIndex={-1}
                    style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'#94a3b8', cursor:'pointer', padding:0, display:'flex' }}>
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p style={{ fontSize:'0.75rem', color:'#ef4444', marginTop:'0.375rem' }}>{errors.password.message}</p>}
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading} style={{
                width:'100%', padding:'0.8125rem',
                background: loading ? '#a5b4fc' : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                color:'#fff', border:'none', borderRadius:9,
                fontSize:'0.9375rem', fontWeight:700, cursor: loading ? 'not-allowed' : 'pointer',
                display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem',
                boxShadow: loading ? 'none' : '0 4px 14px rgba(99,102,241,0.35)',
                transition:'all 0.2s',
              }}>
                {loading ? <><Spinner size="sm" /> Signing in...</> : <>Sign In <ArrowRight size={16} /></>}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', margin:'1.5rem 0 1.125rem' }}>
              <div style={{ flex:1, height:1, background:'#f1f5f9' }} />
              <span style={{ fontSize:'0.6875rem', color:'#94a3b8', fontWeight:600, letterSpacing:'0.06em' }}>DEMO ACCOUNTS</span>
              <div style={{ flex:1, height:1, background:'#f1f5f9' }} />
            </div>

            {/* Demo quick-fill */}
            <div style={{ display:'flex', gap:'0.5rem' }}>
              {DEMO_ACCOUNTS.map(acc => (
                <button key={acc.label} type="button"
                  onClick={() => { setValue('email', acc.email); setValue('password', acc.password); }}
                  style={{
                    flex:1, padding:'0.5rem 0.25rem',
                    background: acc.bg, border:`1px solid ${acc.color}33`,
                    borderRadius:8, color: acc.color,
                    fontSize:'0.7rem', fontWeight:700, cursor:'pointer',
                    transition:'all 0.15s', letterSpacing:'0.01em',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 4px 10px ${acc.color}22`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  {acc.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sign up */}
          <p style={{ textAlign:'center', marginTop:'1.5rem', fontSize:'0.875rem', color:'#64748b' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color:'#6366f1', fontWeight:700, textDecoration:'none' }}>Create one free →</Link>
          </p>
          <p style={{ textAlign:'center', marginTop:'0.75rem' }}>
            <Link to="/" style={{ fontSize:'0.8125rem', color:'#94a3b8', textDecoration:'none' }}>← Back to home</Link>
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .login-left { display: none !important; } }
      `}</style>
    </div>
  );
}
