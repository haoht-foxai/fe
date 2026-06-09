import { useState, useCallback } from 'react';

const AUTH_KEY = 'egov_auth';

const VALID_USER = import.meta.env.VITE_LOGIN_USER ?? 'admin';
const VALID_PASS = import.meta.env.VITE_LOGIN_PASS ?? 'foxai@2026';

export function useAuth() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(AUTH_KEY) === '1');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const login = useCallback((username: string, password: string) => {
    setLoading(true);
    setError(null);

    // Simulate async check (swap for real API if needed)
    setTimeout(() => {
      if (username.trim() === VALID_USER && password === VALID_PASS) {
        sessionStorage.setItem(AUTH_KEY, '1');
        setAuthed(true);
      } else {
        setError('Tên đăng nhập hoặc mật khẩu không đúng.');
      }
      setLoading(false);
    }, 600);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(AUTH_KEY);
    setAuthed(false);
  }, []);

  return { authed, login, logout, error, loading };
}
