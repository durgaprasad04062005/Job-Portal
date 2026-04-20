import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, MapPin, ArrowRight, CheckCircle, Briefcase, Users, TrendingUp, Star, ChevronRight } from 'lucide-react';
import Logo from '../components/ui/Logo';

const CATEGORIES = [
  { icon: '💻', label: 'Software Dev',   count: '1.2k+', color: '#eef2ff', border: '#c7d2fe' },
  { icon: '🎨', label: 'Design',         count: '800+',  color: '#fdf4ff', border: '#e9d5ff' },
  { icon: '📊', label: 'Data Science',   count: '600+',  color: '#f0fdf4', border: '#bbf7d0' },
  { icon: '☁️', label: 'Cloud & DevOps', count: '500+',  color: '#e0f2fe', border: '#bae6fd' },
  { icon: '📱', label: 'Mobile Dev',     count: '400+',  color: '#fff7ed', border: '#fed7aa' },
  { icon: '🔒', label: 'Cybersecurity',  count: '300+',  color: '#fef2f2', border: '#fecaca' },
  { icon: '🤖', label: 'AI & ML',        count: '700+',  color: '#f0fdf4', border: '#86efac' },
  { icon: '📈', label: 'Product Mgmt',   count: '450+',  color: '#fffbeb', border: '#fde68a' },
];

const COMPANIES = ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix', 'Stripe', 'Airbnb'];

const HOW_IT_WORKS = [
  { step: '01', title: 'Create Your Profile', desc: 'Sign up and build a compelling profile with your skills, experience, and resume.' },
  { step: '02', title: 'Discover Opportunities', desc: 'Browse thousands of curated job listings filtered to match your expertise.' },
  { step: '03', title: 'Apply & Get Hired', desc: 'Apply with one click and track your application status in real time.' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (keyword) p.set('keyword', keyword);
    if (location) p.set('location', location);
    navigate(`/jobs?${p.toString()}`);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: 'Inter, sans-serif', color: '#0f172a' }}>

      {/* ══════════════ NAVBAR ══════════════ */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid #f1f5f9',
        padding: '0 2rem', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
          <Logo size="md" />
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          {['Browse Jobs', 'For Employers'].map((label, i) => (
            <Link key={label} to={i === 0 ? '/jobs' : '/register?role=EMPLOYER'}
              style={{ padding: '0.5rem 0.875rem', borderRadius: 8, fontSize: '0.875rem', fontWeight: 500, color: '#475569', textDecoration: 'none', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#0f172a'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#475569'; }}>
              {label}
            </Link>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Link to="/login" style={{ padding: '0.5rem 1rem', borderRadius: 8, fontSize: '0.875rem', fontWeight: 600, color: '#374151', textDecoration: 'none', border: '1px solid #e2e8f0', background: '#fff', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.color = '#6366f1'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#374151'; }}>
            Sign In
          </Link>
          <Link to="/register" style={{ padding: '0.5rem 1.125rem', borderRadius: 8, fontSize: '0.875rem', fontWeight: 700, color: '#fff', textDecoration: 'none', background: 'linear-gradient(135deg,#6366f1,#4f46e5)', boxShadow: '0 2px 8px rgba(99,102,241,0.3)', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(99,102,241,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(99,102,241,0.3)'; }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* ══════════════ HERO ══════════════ */}
      <section style={{ background: 'linear-gradient(180deg, #f8faff 0%, #fff 100%)', padding: '5rem 2rem 4rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Background grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '28px 28px', opacity: 0.5, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 300, background: 'radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: 760, margin: '0 auto' }}>
          {/* Pill badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 9999, padding: '0.375rem 1rem', marginBottom: '2rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151' }}>5,000+ new jobs added this week</span>
            <ChevronRight size={13} color="#6366f1" />
          </div>

          <h1 style={{ fontSize: 'clamp(2.25rem, 5vw, 3.75rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.04em', marginBottom: '1.25rem', color: '#0f172a' }}>
            Find the job you'll<br />
            <span style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              actually love
            </span>
          </h1>

          <p style={{ fontSize: '1.125rem', color: '#64748b', lineHeight: 1.75, maxWidth: 520, margin: '0 auto 2.5rem' }}>
            Connect with top companies, showcase your skills, and land your next role — all in one place.
          </p>

          {/* Search box */}
          <form onSubmit={handleSearch} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '0.625rem', display: 'flex', gap: '0.5rem', maxWidth: 640, margin: '0 auto 1.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 180, display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 0.75rem' }}>
              <Search size={16} color="#94a3b8" style={{ flexShrink: 0 }} />
              <input value={keyword} onChange={e => setKeyword(e.target.value)}
                placeholder="Job title, skills, or company..."
                style={{ border: 'none', outline: 'none', fontSize: '0.9375rem', color: '#0f172a', background: 'transparent', width: '100%' }} />
            </div>
            <div style={{ width: 1, background: '#f1f5f9', margin: '0.25rem 0', flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 140, display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 0.75rem' }}>
              <MapPin size={16} color="#94a3b8" style={{ flexShrink: 0 }} />
              <input value={location} onChange={e => setLocation(e.target.value)}
                placeholder="City or remote..."
                style={{ border: 'none', outline: 'none', fontSize: '0.9375rem', color: '#0f172a', background: 'transparent', width: '100%' }} />
            </div>
            <button type="submit" style={{ padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff', border: 'none', borderRadius: 10, fontSize: '0.9375rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: '0 2px 8px rgba(99,102,241,0.35)', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}>
              Search Jobs
            </button>
          </form>

          {/* Popular tags */}
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8125rem', color: '#94a3b8', marginRight: '0.25rem' }}>Popular:</span>
            {['React', 'Java', 'Python', 'AWS', 'DevOps', 'Machine Learning'].map(tag => (
              <button key={tag} onClick={() => navigate(`/jobs?keyword=${tag}`)}
                style={{ padding: '0.3rem 0.75rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 9999, fontSize: '0.8125rem', color: '#475569', cursor: 'pointer', fontWeight: 500, transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.color = '#6366f1'; e.currentTarget.style.background = '#eef2ff'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#475569'; e.currentTarget.style.background = '#f8fafc'; }}>
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ TRUSTED BY ══════════════ */}
      <section style={{ padding: '2rem 2rem', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', background: '#fafafa' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '0.8125rem', color: '#94a3b8', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Trusted by professionals from</p>
          <div style={{ display: 'flex', gap: '2.5rem', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
            {COMPANIES.map(c => (
              <span key={c} style={{ fontSize: '1rem', fontWeight: 800, color: '#cbd5e1', letterSpacing: '-0.02em' }}>{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ STATS ══════════════ */}
      <section style={{ padding: '4rem 2rem', background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          {[
            { value: '50K+', label: 'Active Job Listings', icon: Briefcase, color: '#6366f1', bg: '#eef2ff' },
            { value: '10K+', label: 'Verified Companies', icon: Users, color: '#0284c7', bg: '#e0f2fe' },
            { value: '200K+', label: 'Registered Job Seekers', icon: TrendingUp, color: '#059669', bg: '#f0fdf4' },
            { value: '95%', label: 'Placement Success Rate', icon: Star, color: '#d97706', bg: '#fffbeb' },
          ].map(s => (
            <div key={s.label} style={{ background: '#fafafa', border: '1px solid #f1f5f9', borderRadius: 14, padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <s.icon size={22} color={s.color} />
              </div>
              <div>
                <div style={{ fontSize: '1.625rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '0.25rem' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════ CATEGORIES ══════════════ */}
      <section style={{ padding: '5rem 2rem', background: '#fafafa' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>Browse by Category</h2>
            <p style={{ color: '#64748b', fontSize: '1.0625rem', maxWidth: 480, margin: '0 auto' }}>Explore curated opportunities across every tech discipline</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.875rem' }}>
            {CATEGORIES.map(cat => (
              <button key={cat.label} onClick={() => navigate(`/jobs?category=${cat.label}`)}
                style={{ background: cat.color, border: `1px solid ${cat.border}`, borderRadius: 12, padding: '1.25rem 0.875rem', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{cat.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '0.8125rem', color: '#1e293b', marginBottom: '0.2rem' }}>{cat.label}</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 500 }}>{cat.count} jobs</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ HOW IT WORKS ══════════════ */}
      <section style={{ padding: '5rem 2rem', background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>How it works</h2>
            <p style={{ color: '#64748b', fontSize: '1.0625rem' }}>Get hired in three simple steps</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} style={{ position: 'relative', background: '#fafafa', border: '1px solid #f1f5f9', borderRadius: 16, padding: '2rem' }}>
                <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#6366f1', letterSpacing: '0.1em', marginBottom: '1rem', textTransform: 'uppercase' }}>Step {step.step}</div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.625rem', letterSpacing: '-0.02em' }}>{step.title}</h3>
                <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.7 }}>{step.desc}</p>
                {i < HOW_IT_WORKS.length - 1 && (
                  <div style={{ position: 'absolute', right: '-0.75rem', top: '50%', transform: 'translateY(-50%)', zIndex: 1, display: 'none' }} className="step-arrow">
                    <ArrowRight size={18} color="#cbd5e1" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ CTA ══════════════ */}
      <section style={{ padding: '5rem 2rem', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: 400, height: 400, borderRadius: '50%', background: 'rgba(99,102,241,0.15)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: 350, height: 350, borderRadius: '50%', background: 'rgba(14,165,233,0.1)', filter: 'blur(70px)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1.15, marginBottom: '1.25rem' }}>
            Ready to land your<br />dream job?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.0625rem', marginBottom: '2.5rem', lineHeight: 1.7 }}>
            Join thousands of professionals who found their perfect role through JobPortal. It's free to get started.
          </p>
          <div style={{ display: 'flex', gap: '0.875rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register?role=STUDENT" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 1.75rem', background: '#fff', color: '#4f46e5', borderRadius: 10, fontWeight: 800, fontSize: '0.9375rem', textDecoration: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.2)', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}>
              I'm a Job Seeker <ArrowRight size={16} />
            </Link>
            <Link to="/register?role=EMPLOYER" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 1.75rem', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.25)', borderRadius: 10, fontWeight: 700, fontSize: '0.9375rem', textDecoration: 'none', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}>
              I'm Hiring <ArrowRight size={16} />
            </Link>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8125rem', marginTop: '1.5rem' }}>No credit card required · Free forever for job seekers</p>
        </div>
      </section>

      {/* ══════════════ FOOTER ══════════════ */}
      <footer style={{ background: '#0f172a', padding: '2.5rem 2rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <Logo size="sm" />          </div>
          <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.3)' }}>© 2024 JobPortal. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Privacy', 'Terms', 'Contact'].map(l => (
              <a key={l} href="#" style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.35)', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; }}>
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
