import {
  useState, useRef, useCallback,
  type DragEvent, type ChangeEvent,
} from 'react';
import { findDocument } from '../api/documents';
import type { FindDocumentResult } from '../types/document';

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function ResultCard({ result }: { result: FindDocumentResult }) {
  if (result.found) {
    return (
      <div className="fd-result fd-result-found">
        <div className="fd-result-icon">✅</div>
        <div className="fd-result-body">
          <div className="fd-result-title">Tìm thấy văn bản!</div>
          <div className="fd-result-rows">
            <div className="fd-result-row">
              <span className="fd-result-lbl">Số trích yếu</span>
              <strong className="fd-result-val">{result.reference_number}</strong>
            </div>
            <div className="fd-result-row">
              <span className="fd-result-lbl">Số văn bản</span>
              <strong className="fd-result-val">{result.document_number ?? '—'}</strong>
            </div>
            <div className="fd-result-row">
              <span className="fd-result-lbl">File chứa</span>
              <span className="fd-result-filename" title={result.filename ?? ''}>
                📄 {result.filename}
              </span>
            </div>
          </div>
          {result.message && (
            <p className="fd-result-msg">{result.message}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fd-result fd-result-notfound">
      <div className="fd-result-icon">❌</div>
      <div className="fd-result-body">
        <div className="fd-result-title">Không tìm thấy</div>
        <p className="fd-result-desc">
          Số trích yếu <strong>"{result.reference_number}"</strong> không xuất hiện
          trong {result.filename ? '1 file đã kiểm tra' : 'các file đã upload'}.
        </p>
        {result.message && <p className="fd-result-msg">{result.message}</p>}
      </div>
    </div>
  );
}

export function FindDocument() {
  const [refNumber, setRefNumber]   = useState('');
  const [files, setFiles]           = useState<File[]>([]);
  const [result, setResult]         = useState<FindDocumentResult | null>(null);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [dragging, setDragging]     = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((incoming: FileList | File[]) => {
    const arr = Array.from(incoming);
    setFiles((prev) => {
      const existing = new Set(prev.map((f) => f.name));
      return [...prev, ...arr.filter((f) => !existing.has(f.name))];
    });
  }, []);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files);
    e.target.value = '';
  };

  const removeFile = (name: string) =>
    setFiles((prev) => prev.filter((f) => f.name !== name));

  const handleSubmit = async () => {
    if (!refNumber.trim() || files.length === 0 || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await findDocument(refNumber.trim(), files);
      setResult(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Có lỗi khi gọi API');
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = !!refNumber.trim() && files.length > 0 && !loading;

  return (
    <div className="fd-wrap">
      <div className="fd-card">
        <div className="fd-card-header">
          <span className="fd-header-icon">🔎</span>
          <div>
            <h2>Tìm số trích yếu trong văn bản</h2>
            <p>Nhập số trích yếu và upload file PDF để kiểm tra</p>
          </div>
        </div>

        {/* Reference number */}
        <div className="fd-field">
          <label className="fd-label">Số trích yếu văn bản</label>
          <div className="fd-input-wrap">
            <span className="fd-input-icon">🔢</span>
            <input
              className="fd-input"
              type="text"
              placeholder="Ví dụ: 5782/UBND-XD"
              value={refNumber}
              onChange={(e) => setRefNumber(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              disabled={loading}
            />
            {refNumber && (
              <button
                className="fd-input-clear"
                onClick={() => { setRefNumber(''); setResult(null); }}
                disabled={loading}
              >×</button>
            )}
          </div>
        </div>

        {/* Drop zone */}
        <div className="fd-field">
          <label className="fd-label">
            File văn bản
            <span className="fd-label-sub"> (PDF, có thể chọn nhiều file)</span>
          </label>
          <div
            className={`fd-dropzone${dragging ? ' fd-dragging' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={() => setDragging(false)}
            onClick={() => !loading && fileInputRef.current?.click()}
            style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,application/pdf"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <div className="fd-drop-icon">{dragging ? '📂' : '📁'}</div>
            <p className="fd-drop-text">
              {dragging
                ? 'Thả file vào đây'
                : <>Kéo thả file hoặc <span className="fd-drop-link">click để chọn</span></>}
            </p>
            <p className="fd-drop-hint">Hỗ trợ nhiều file PDF cùng lúc</p>
          </div>
        </div>

        {/* File list */}
        {files.length > 0 && (
          <div className="fd-filelist">
            <div className="fd-filelist-header">
              <span>📋 {files.length} file đã chọn</span>
              <button
                className="fd-clear-all"
                onClick={() => setFiles([])}
                disabled={loading}
              >Xóa tất cả</button>
            </div>
            {files.map((f) => (
              <div key={f.name} className="fd-fileitem">
                <span className="fd-file-icon">📄</span>
                <span className="fd-file-name" title={f.name}>{f.name}</span>
                <span className="fd-file-size">{formatSize(f.size)}</span>
                <button
                  className="fd-file-remove"
                  onClick={() => removeFile(f.name)}
                  disabled={loading}
                >×</button>
              </div>
            ))}
          </div>
        )}

        {/* Submit */}
        <button
          className="fd-btn"
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          {loading ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5"
                style={{ animation: 'spin 0.8s linear infinite', flexShrink: 0 }}>
                <path d="M1 4v6h6"/><path d="M23 20v-6h-6"/>
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15"/>
              </svg>
              Đang tìm kiếm...
            </>
          ) : (
            <>🔍 Tìm kiếm</>
          )}
        </button>

        {/* Error */}
        {error && (
          <div className="fd-error">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Result */}
        {result && <ResultCard result={result} />}
      </div>
    </div>
  );
}
