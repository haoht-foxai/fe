import type { DocumentSummary } from '../types/document';
import { DocumentCard } from './DocumentCard';

interface DocumentListProps {
  documents: DocumentSummary[];
  offset?: number;
  onSelect?: (analysisId: string) => void;
  selectedId?: string | null;
}

export function DocumentList({ documents, offset = 0, onSelect, selectedId }: DocumentListProps) {
  if (documents.length === 0) {
    return <div className="empty-state">Không có tài liệu nào để hiển thị.</div>;
  }

  return (
    <div className="document-grid">
      {documents.map((document, i) => (
        <DocumentCard
          key={document.analysis_id}
          document={document}
          index={offset + i}
          onSelect={onSelect ?? (() => {})}
          selected={selectedId === document.analysis_id}
        />
      ))}
    </div>
  );
}
