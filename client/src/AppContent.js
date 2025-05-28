import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Box,
  CssBaseline,
  Button,
  Paper,
  List,
  IconButton
} from '@mui/material';
import { Brightness4, Brightness7, WbSunny } from '@mui/icons-material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { ThemeContext, ThemeProvider } from './contexts/ThemeContext';
import TodoForm from './components/TodoForm';
import TodoItem from './components/TodoItem';
import AuthForm from './components/AuthForm';
import axios from 'axios';

// Rename this to AppContent
function AppContent() {
  const [todos, setTodos] = useState([]);
  const [user, setUser] = useState(null);
  const { theme, toggleTheme, mode } = useContext(ThemeContext);

  // Set auth token
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  };

  // Fetch todos
  const fetchTodos = async () => {
    try {
      const res = await axios.get('/api/todos');
      setTodos(res.data);
    } catch (err) {
      console.error('Failed to fetch todos:', err);
    }
  };

  // Auth handlers
  const handleAuthSuccess = (data) => {
    setAuthToken(data.token);
    setUser(data.user);
    fetchTodos();
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    setTodos([]);
  };

  // Todo handlers
  const addTodo = async (newTodo) => {
    try {
      await axios.post('/api/todos', newTodo);
      fetchTodos();
    } catch (err) {
      console.error('Failed to add todo:', err);
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      await axios.patch(`/api/todos/${id}`, { completed: !completed });
      fetchTodos();
    } catch (err) {
      console.error('Failed to update todo:', err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`);
      fetchTodos();
    } catch (err) {
      console.error('Failed to delete todo:', err);
    }
  };

  // Check auth on load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      fetchTodos();
    }
  }, []);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <img
              src="/assets/logo.png"
              alt="App Logo"
              style={{ height: 40, marginRight: 12 }}
            />
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
              To-do List
            </Typography>
          </Box>
          {user && (
            <Button color="inherit" onClick={logout}>Logout</Button>
          )}
          <IconButton
            color="inherit"
            onClick={() => toggleTheme(mode === 'light' ? 'dark' : 'light')}
          >
            {mode === 'dark' ? <WbSunny /> : <Brightness4 />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        {!user ? (
          <AuthForm onAuthSuccess={handleAuthSuccess} />
        ) : (
          <>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <TodoForm onSubmit={addTodo} />
            </Paper>
            <Paper elevation={3} sx={{ p: 2 }}>
              <List>
                {todos.map(todo => (
                  <TodoItem
                    key={todo._id}
                    todo={todo}
                    onToggle={toggleComplete}
                    onDelete={deleteTodo}
                  />
                ))}
              </List>
            </Paper>
          </>
        )}
      </Container>
    </MuiThemeProvider>
  );
}

// Default export wraps AppContent with ThemeProvider
export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}