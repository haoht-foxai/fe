import { useState, useCallback } from 'react';
import { fetchDocumentDetail } from '../api/documents';
import type { DocumentDetail } from '../types/document';

export function useDocumentDetail() {
  const [detail, setDetail] = useState<DocumentDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const open = useCallback((analysisId: string) => {
    setSelectedId(analysisId);
    setDetail(null);
    setError(null);
    setLoading(true);

    fetchDocumentDetail(analysisId)
      .then(setDetail)
      .catch((err: Error) => setError(err.message || 'Không thể tải chi tiết.'))
      .finally(() => setLoading(false));
  }, []);

  const close = useCallback(() => {
    setSelectedId(null);
    setDetail(null);
    setError(null);
  }, []);

  return { detail, loading, error, selectedId, open, close };
}
