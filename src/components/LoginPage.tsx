import { useState, type FormEvent } from 'react';

interface Props {
  onLogin: (username: string, password: string) => void;
  error: string | null;
  loading: boolean;
}

export function LoginPage({ onLogin, error, loading }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="login-root">
      {/* Left panel — branding */}
      <div className="login-panel-left">
        <div className="login-brand-wrap">
          <div className="login-logos">
            <div className="login-logo-fox">🦊</div>
            <div className="login-logo-plus">×</div>
            <div className="login-logo-egov">🏛️</div>
          </div>
          <h1 className="login-brand-title">FoxAI × eGov</h1>
          <p className="login-brand-sub">
            Nền tảng chuyển đổi số hành chính công — thông minh, bảo mật, hiệu quả
          </p>

          <div className="login-features">
            <div className="login-feature">
              <span className="lf-icon">⚡</span>
              <span>Phân tích tài liệu tốc độ cao</span>
            </div>
            <div className="login-feature">
              <span className="lf-icon">🔒</span>
              <span>Bảo mật chuẩn chính phủ</span>
            </div>
            <div className="login-feature">
              <span className="lf-icon">📊</span>
              <span>Báo cáo trực quan real-time</span>
            </div>
          </div>
        </div>

        <div className="login-dev-credit">
          <div className="ldc-line" />
          <span>Phát triển bởi</span>
          <strong>FoxAI</strong>
          <span className="ldc-year">© 2026</span>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="login-panel-right">
        <div className="login-card">
          <div className="login-card-header">
            <div className="login-card-icon">🏛️</div>
            <h2>Đăng nhập hệ thống</h2>
            <p>EGOV Document Monitor</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="login-field">
              <label htmlFor="lf-user">Tên đăng nhập</label>
              <div className="login-input-wrap">
                <span className="li-icon">👤</span>
                <input
                  id="lf-user"
                  type="text"
                  className="login-input"
                  placeholder="Nhập tên đăng nhập"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="lf-pass">Mật khẩu</label>
              <div className="login-input-wrap">
                <span className="li-icon">🔑</span>
                <input
                  id="lf-pass"
                  type={showPass ? 'text' : 'password'}
                  className="login-input"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="li-toggle"
                  onClick={() => setShowPass((v) => !v)}
                  tabIndex={-1}
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {error && (
              <div className="login-error">
                <span>⚠️</span> {error}
              </div>
            )}

            <button
              type="submit"
              className="login-btn"
              disabled={loading || !username || !password}
            >
              {loading ? (
                <span className="login-btn-spinner">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                  Đang đăng nhập...
                </span>
              ) : (
                'Đăng nhập →'
              )}
            </button>
          </form>

          <div className="login-card-footer">
            <span>Powered by</span>
            <strong>FoxAI Platform</strong>
            <span>v1.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
