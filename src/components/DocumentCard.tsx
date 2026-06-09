import type { DocumentSummary } from '../types/document';

const fmtDateTime = (value: string | null) => {
  if (!value || value === 'null') return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? value
    : d.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
};

const fmtDate = (value: string | null) => {
  if (!value || value === 'null') return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString('vi-VN');
};

interface Props {
  document: DocumentSummary;
  index: number;
  onSelect: (analysisId: string) => void;
  selected: boolean;
}

export function DocumentCard({ document: doc, index, onSelect, selected }: Props) {
  const isMulti = doc.file_count > 1;
  const createdLabel = fmtDateTime(doc.created_at);

  return (
    <article
      className={`document-card ${selected ? 'card-selected' : ''}`}
      onClick={() => onSelect(doc.analysis_id)}
      style={{ cursor: 'pointer' }}
    >
      <div className="card-top">
        <span className="card-index">#{index + 1}</span>
        <p className="card-title">{doc.document_title}</p>
      </div>
      <div className="card-body">
        <div className="card-row">
          <span className="card-label">Mã văn bản</span>
          <span className="card-value">
            {doc.document_number && doc.document_number !== 'null'
              ? doc.document_number
              : <span className="text-muted">Chưa có</span>}
          </span>
        </div>
        <div className="card-row">
          <span className="card-label">Ngày văn bản</span>
          <span className="card-value">
            {fmtDate(doc.document_date) ?? <span className="text-muted">Chưa có</span>}
          </span>
        </div>
        <div className="card-row">
          <span className="card-label">Analysis ID</span>
          <span className="card-value mono" title={doc.analysis_id}>
            {doc.analysis_id.slice(0, 8)}…
          </span>
        </div>
        <div className="card-row">
          <span className="card-label">Company ID</span>
          <span className="card-value mono" title={doc.company_id}>
            {doc.company_id.slice(0, 8)}…
          </span>
        </div>
      </div>
      <div className="card-footer">
        <span className={`badge ${isMulti ? 'badge-files-multi' : 'badge-files-1'}`}>
          📁 {doc.file_count} file{isMulti ? 's' : ''}
        </span>
        {createdLabel && (
          <span className="badge badge-date">🕐 {createdLabel}</span>
        )}
        <span className="card-detail-hint">Chi tiết →</span>
      </div>
    </article>
  );
}
