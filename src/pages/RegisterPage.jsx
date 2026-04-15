import { useState } from 'react';
import { Link } from 'react-router-dom';
import { registerDriver, registerUser } from '../api/authApi';

export default function RegisterPage() {
  const [role, setRole] = useState('USER');
  const [body, setBody] = useState('{\n  "name": "",\n  "email": "",\n  "password": ""\n}');
  const [message, setMessage] = useState('');

  const submit = async () => {
    try {
      const payload = JSON.parse(body);
      const call = role === 'USER' ? registerUser : registerDriver;
      await call(payload);
      setMessage('Registration success. Please login.');
    } catch (e) {
      setMessage(e.response?.data?.message || e.message);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h1>Register</h1>
        <div className="row">
          <button className={role === 'USER' ? 'active' : ''} onClick={() => setRole('USER')}>User Register</button>
          <button className={role === 'DRIVER' ? 'active' : ''} onClick={() => setRole('DRIVER')}>Driver Register</button>
        </div>
        <textarea rows={10} value={body} onChange={(e) => setBody(e.target.value)} />
        {message && <p>{message}</p>}
        <button onClick={submit}>Submit</button>
        <Link to="/login">Back to login</Link>
      </div>
    </div>
  );
}
