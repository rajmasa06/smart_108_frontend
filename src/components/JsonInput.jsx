import { useState } from 'react';

export default function JsonInput({ label, defaultJson = '{}', onSubmit, buttonText = 'Send' }) {
  const [value, setValue] = useState(defaultJson);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    try {
      const payload = JSON.parse(value || '{}');
      setError('');
      onSubmit(payload);
    } catch {
      setError('Invalid JSON. Please check commas and quotes.');
    }
  };

  return (
    <div className="card">
      <h3>{label}</h3>
      <textarea value={value} onChange={(e) => setValue(e.target.value)} rows={7} />
      {error && <p className="error">{error}</p>}
      <button onClick={handleSubmit}>{buttonText}</button>
    </div>
  );
}
