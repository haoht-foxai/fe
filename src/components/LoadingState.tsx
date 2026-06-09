export function LoadingState({ count = 5 }: { count?: number }) {
  return (
    <div className="skeleton-wrapper">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-line title" />
          <div className="skeleton-line medium" />
          <div className="skeleton-line short" />
        </div>
      ))}
    </div>
  );
}
