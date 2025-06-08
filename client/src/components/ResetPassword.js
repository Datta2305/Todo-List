import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg('');
    setError('');
    try {
      const res = await fetch(process.env.REACT_APP_API_URL + `/api/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || 'Error');
      else setMsg(data.message);
    } catch {
      setError('Network error');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Reset Password</h2>
      <input
        type="password"
        placeholder="Enter new password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button type="submit">Reset Password</button>
      {msg && <div style={{ color: 'green' }}>{msg}</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </form>
  );
};

export default ResetPassword;