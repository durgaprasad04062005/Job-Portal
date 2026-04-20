import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const delta = 2;
  const left = Math.max(0, page - delta);
  const right = Math.min(totalPages - 1, page + delta);

  for (let i = left; i <= right; i++) pages.push(i);

  return (
    <div className="pagination">
      <button
        className="page-btn"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
      >
        <ChevronLeft size={16} />
      </button>

      {left > 0 && (
        <>
          <button className="page-btn" onClick={() => onPageChange(0)}>1</button>
          {left > 1 && <span style={{ color: 'var(--gray-400)' }}>…</span>}
        </>
      )}

      {pages.map(p => (
        <button
          key={p}
          className={`page-btn ${p === page ? 'active' : ''}`}
          onClick={() => onPageChange(p)}
        >
          {p + 1}
        </button>
      ))}

      {right < totalPages - 1 && (
        <>
          {right < totalPages - 2 && <span style={{ color: 'var(--gray-400)' }}>…</span>}
          <button className="page-btn" onClick={() => onPageChange(totalPages - 1)}>
            {totalPages}
          </button>
        </>
      )}

      <button
        className="page-btn"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages - 1}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
