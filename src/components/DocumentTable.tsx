import type { DocumentSummary } from '../types/document';

const fmtDate = (value: string | null) => {
  if (!value || value === 'null') return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString('vi-VN');
};

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

interface Props {
  documents: DocumentSummary[];
  offset: number;
  onSelect: (analysisId: string) => void;
  selectedId: string | null;
}

export function DocumentTable({ documents, offset, onSelect, selectedId }: Props) {
  return (
    <div className="table-wrapper">
      <table className="document-table">
        <thead>
          <tr>
            <th className="col-num">#</th>
            <th className="col-title">Tiêu đề tài liệu</th>
            <th className="col-code">Mã văn bản</th>
            <th className="col-date">Ngày văn bản</th>
            <th className="col-files">Số file</th>
            <th className="col-created">Ngày import</th>
            <th className="col-action"></th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc, i) => (
            <tr
              key={doc.analysis_id}
              className={selectedId === doc.analysis_id ? 'row-selected' : ''}
              onClick={() => onSelect(doc.analysis_id)}
              style={{ cursor: 'pointer' }}
            >
              <td className="col-num">{offset + i + 1}</td>
              <td className="col-title">
                <div className="title-text" title={doc.document_title}>
                  {doc.document_title}
                </div>
              </td>
              <td className="col-code">
                {doc.document_number && doc.document_number !== 'null' ? (
                  doc.document_number
                ) : (
                  <span className="text-muted">—</span>
                )}
              </td>
              <td className="col-date">
                {fmtDate(doc.document_date) ?? <span className="text-muted">—</span>}
              </td>
              <td className="col-files">
                <span className={`badge ${doc.file_count > 1 ? 'badge-files-multi' : 'badge-files-1'}`}>
                  {doc.file_count}
                </span>
              </td>
              <td className="col-created">
                {fmtDateTime(doc.created_at) ?? <span className="text-muted">—</span>}
              </td>
              <td className="col-action">
                <span className="row-detail-hint">Chi tiết →</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
