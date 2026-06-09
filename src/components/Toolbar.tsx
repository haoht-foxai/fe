import type { ViewMode } from '../types/document';

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  view: ViewMode;
  onViewChange: (v: ViewMode) => void;
  onRefresh: () => void;
  loading: boolean;
  resultCount: number;
  totalCount: number;
}

const RefreshIcon = ({ spinning }: { spinning: boolean }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    style={{ flexShrink: 0, ...(spinning ? { animation: 'spin 0.8s linear infinite' } : {}) }}
  >
    <path d="M1 4v6h6" />
    <path d="M23 20v-6h-6" />
    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15" />
  </svg>
);

export function Toolbar({
  search,
  onSearchChange,
  view,
  onViewChange,
  onRefresh,
  loading,
  resultCount,
  totalCount,
}: Props) {
  return (
    <div className="toolbar">
      <div className="search-wrapper">
        <span className="search-icon">🔍</span>
        <input
          className="search-input"
          type="text"
          placeholder="Tìm kiếm theo tiêu đề tài liệu..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {search && (
        <span className="filter-count">
          {resultCount} / {totalCount} kết quả
        </span>
      )}

      <div className="toolbar-divider" />

      <div className="view-toggle">
        <button
          className={`view-btn ${view === 'card' ? 'active' : ''}`}
          onClick={() => onViewChange('card')}
        >
          🃏 Cards
        </button>
        <button
          className={`view-btn ${view === 'table' ? 'active' : ''}`}
          onClick={() => onViewChange('table')}
        >
          📋 Bảng
        </button>
      </div>

      <div className="toolbar-divider" />

      <button
        className="btn-refresh"
        onClick={onRefresh}
        disabled={loading}
      >
        <RefreshIcon spinning={loading} />
        {loading ? 'Đang tải...' : 'Làm mới'}
      </button>
    </div>
  );
}
