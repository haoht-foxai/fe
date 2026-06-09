import { useState, useEffect, useCallback } from 'react';
import { fetchQuickAnalyzeDocuments } from '../api/documents';
import type { DocumentSummary } from '../types/document';

const PAGE_SIZE = 20;

export function useDocuments() {
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchQuickAnalyzeDocuments(PAGE_SIZE, offset)
      .then(setDocuments)
      .catch((err: Error) => setError(err.message || 'Có lỗi khi tải dữ liệu.'))
      .finally(() => setLoading(false));
  }, [offset]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    documents,
    offset,
    currentPage: Math.floor(offset / PAGE_SIZE) + 1,
    pageSize: PAGE_SIZE,
    loading,
    error,
    hasNext: documents.length === PAGE_SIZE,
    hasPrev: offset > 0,
    nextPage: () => setOffset((o) => o + PAGE_SIZE),
    prevPage: () => setOffset((o) => Math.max(0, o - PAGE_SIZE)),
    refresh: load,
  };
}
