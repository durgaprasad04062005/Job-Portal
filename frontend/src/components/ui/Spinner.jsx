export default function Spinner({ size = 'md', fullScreen = false }) {
  const sizes = { sm: 16, md: 24, lg: 40, xl: 56 };
  const px = sizes[size] || 24;

  const spinner = (
    <svg
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="none"
      style={{ animation: 'spin 0.8s linear infinite' }}
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.2" />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );

  if (fullScreen) {
    return (
      <div style={{
        position: 'fixed', inset: 0, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        background: 'rgba(255,255,255,0.8)', zIndex: 9999,
        color: 'var(--primary)'
      }}>
        {spinner}
      </div>
    );
  }

  return <span style={{ color: 'var(--primary)', display: 'inline-flex' }}>{spinner}</span>;
}
