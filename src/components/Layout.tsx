import type { ReactNode } from 'react';

interface Props {
  loading: boolean;
  error: boolean;
  onLogout: () => void;
  children: ReactNode;
}

export function Layout({ loading, error, onLogout, children }: Props) {
  const statusLabel = loading ? 'Đang tải...' : error ? 'Lỗi kết nối' : 'Đã kết nối';
  const dotClass = `status-dot${loading ? ' loading' : error ? ' error' : ''}`;

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="header-inner">
          <div className="header-brand">
            <div className="header-logo">🏛️</div>
            <div className="header-title">
              <h1>EGOV Document Monitor</h1>
              <p>FoxAI × eGov — Kiểm tra file import của khách hàng</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="header-status">
              <span className={dotClass} />
              <span>{statusLabel}</span>
            </div>
            <button className="btn-logout" onClick={onLogout} title="Đăng xuất">
              🚪 Đăng xuất
            </button>
          </div>
        </div>
      </header>
      <main className="app-main">{children}</main>
      <footer className="app-footer">
        © 2026 FoxAI eGov — Phát triển bởi <strong style={{ color: '#2563eb' }}>Hà Thanh Hào</strong>
      </footer>
    </div>
  );
}
