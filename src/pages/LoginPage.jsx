import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/authApi';

export default function LoginPage() {
  const [form, setForm] = useState('{\n  "email": "",\n  "password": ""\n}');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const payload = JSON.parse(form);
      const res = await login(payload);
      const token = res.data?.token || res.data?.accessToken || res.data?.jwt || '';
      if (!token) {
        setError('Token field not found in login response. Check backend response key.');
        return;
      }
      localStorage.setItem('token', token);
      localStorage.setItem('role', String(res.data?.role || payload.role || '').toUpperCase());
      if (String(res.data?.role || payload.role || '').toUpperCase().includes('AMBULANCE')) {
        navigate('/driver');
      } else {
        navigate('/user');
      }
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h1>Smart 108 Login</h1>
        <p>Use exact backend login payload JSON.</p>
        <textarea rows={10} value={form} onChange={(e) => setForm(e.target.value)} />
        {error && <p className="error">{error}</p>}
        <button onClick={handleLogin}>Login</button>
        <Link to="/register">Need account? Register</Link>
      </div>
    </div>
  );
}
