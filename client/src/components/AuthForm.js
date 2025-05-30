import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Link,
  Stack,
  Paper
} from '@mui/material';



const AuthForm = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const baseUrl = 'https://todo-list-kq4p.onrender.com'; // <-- Add this line
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
      } catch (e) {
        throw new Error('Server returned an invalid response.');
      }

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      setSuccess(isLogin ? 'Login Successful!' : 'Registered Successfully!');
      setTimeout(() => {
        onAuthSuccess(data);
      }, 1000); // Wait 1 second before proceeding
    } catch (err) {
      setError(err.message);
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
          >
            {isLogin ? 'Login' : 'Register'}
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