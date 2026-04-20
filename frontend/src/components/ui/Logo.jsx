/**
 * Logo component — renders the Job Portal logo image + wordmark.
 *
 * Props:
 *   size     — 'sm' | 'md' | 'lg'  (default: 'md')
 *   dark     — true = white text (for dark backgrounds)
 *   iconOnly — true = show only the icon, no text
 */
export default function Logo({ size = 'md', dark = false, iconOnly = false }) {
  const sizes = {
    sm: { icon: 28, fontSize: '0.9375rem',  gap: '0.5rem'  },
    md: { icon: 36, fontSize: '1.125rem',   gap: '0.625rem' },
    lg: { icon: 48, fontSize: '1.5rem',     gap: '0.75rem'  },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: s.gap, textDecoration: 'none' }}>
      {/* Icon */}
      <img
        src="/logo.svg"
        alt="Job Portal Logo"
        width={s.icon}
        height={s.icon}
        style={{ display: 'block', flexShrink: 0 }}
      />

      {/* Wordmark */}
      {!iconOnly && (
        <span style={{
          fontWeight: 900,
          fontSize: s.fontSize,
          letterSpacing: '-0.02em',
          color: dark ? '#ffffff' : '#1e3a5f',
          lineHeight: 1,
          fontFamily: 'Inter, sans-serif',
        }}>
          JOB <span style={{ color: dark ? '#93c5fd' : '#6366f1' }}>PORTAL</span>
        </span>
      )}
    </div>
  );
}
