interface Props {
  currentPage: number;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  offset: number;
  count: number;
}

export function Pagination({
  currentPage,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
  offset,
  count,
}: Props) {
  return (
    <div className="pagination">
      <div className="pagination-info">
        Hiển thị <strong>{offset + 1}–{offset + count}</strong> tài liệu
      </div>
      <div className="pagination-buttons">
        <button className="btn-page" onClick={onPrev} disabled={!hasPrev}>
          ← Trang trước
        </button>
        <span className="page-indicator">Trang {currentPage}</span>
        <button className="btn-page" onClick={onNext} disabled={!hasNext}>
          Trang tiếp →
        </button>
      </div>
    </div>
  );
}
