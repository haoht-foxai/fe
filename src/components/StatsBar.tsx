import type { DocumentSummary } from '../types/document';

interface Props {
  documents: DocumentSummary[];
  filtered: DocumentSummary[];
  currentPage: number;
}

export function StatsBar({ documents, filtered, currentPage }: Props) {
  const totalFiles = documents.reduce((sum, d) => sum + d.file_count, 0);
  const avgFiles = documents.length
    ? (totalFiles / documents.length).toFixed(1)
    : '0';

  return (
    <div className="stats-bar">
      <div className="stat-card">
        <div className="stat-icon blue">📄</div>
        <div className="stat-content">
          <div className="stat-value">{filtered.length}</div>
          <div className="stat-label">Tài liệu hiển thị</div>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon green">📁</div>
        <div className="stat-content">
          <div className="stat-value">{totalFiles}</div>
          <div className="stat-label">Tổng số file</div>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon orange">📊</div>
        <div className="stat-content">
          <div className="stat-value">{avgFiles}</div>
          <div className="stat-label">TB file / tài liệu</div>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon purple">📑</div>
        <div className="stat-content">
          <div className="stat-value">{currentPage}</div>
          <div className="stat-label">Trang hiện tại</div>
        </div>
      </div>
    </div>
  );
}
