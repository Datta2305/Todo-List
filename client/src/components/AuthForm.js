import React, { useState } from 'react';
import { Paper, Typography, Box, Stack, TextField, Button, Link, CircularProgress } from '@mui/material';

const AuthForm = ({ onAuthSuccess }) => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const baseUrl = 'https://todo-list-kq4p.onrender.com';
      const endpoint = isLogin ? '/api/login' : '/api/register';
      const payload = isLogin
        ? { email: form.email, password: form.password }
        : form;

      const response = await fetch(baseUrl + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error('Server returned an invalid response.');
      }

      if (!response.ok) {
        // Try to show backend error, fallback to status text or generic message
        if (data && data.error) {
          setError(data.error);
        } else if (response.status === 400) {
          setError('Invalid input or user already exists.');
        } else if (response.status === 401) {
          setError('Invalid credentials.');
        } else {
          setError(response.statusText || 'Authentication failed');
        }
        setLoading(false);
        return;
      }

      setSuccess(isLogin ? 'Login Successful!' : 'Registered Successfully!');
      onAuthSuccess(data); // Immediately update parent
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: 'auto' }}>
      <Typography variant="h5" component="h1" gutterBottom align="center">
        {isLogin ? 'Login' : 'Register'}
      </Typography>

      {error && (
        <Typography color="error" align="center" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {success && (
        <Typography color="success.main" align="center" sx={{ mb: 2 }}>
          {success}
        </Typography>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          {!isLogin && (
            <TextField
              label="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
            />
          )}

          <TextField
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            fullWidth
            variant="outlined"
          />

          <TextField
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            fullWidth
            variant="outlined"
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loading ? 'Loading...' : (isLogin ? 'Login' : 'Register')}
          </Button>

          <Typography align="center" sx={{ mt: 2 }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Link
              component="button"
              onClick={() => setIsLogin(!isLogin)}
              underline="hover"
            >
              {isLogin ? 'Register here' : 'Login here'}
            </Link>
          </Typography>
        </Stack>
      </Box>
    </Paper>
  );
};

export default AuthForm;