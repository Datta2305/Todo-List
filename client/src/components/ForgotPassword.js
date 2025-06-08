import React, { useState } from 'react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg('');
    setError('');
    try {
      const res = await fetch(process.env.REACT_APP_API_URL + '/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
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
      <h2>Forgot Password</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <button type="submit">Send Reset Link</button>
      {msg && <div style={{ color: 'green' }}>{msg}</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </form>
  );
};

export default ForgotPassword;