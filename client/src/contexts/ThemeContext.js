import { createContext, useState, useEffect, useMemo } from 'react';
import { createTheme } from '@mui/material/styles';

export const ThemeContext = createContext({
  theme: null,
  toggleTheme: () => {},
  mode: 'light'
});

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');

  useEffect(() => {
    const savedMode = localStorage.getItem('themeMode') || 'system';
    if (savedMode === 'system') {
      setMode(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    } else {
      setMode(savedMode);
    }
  }, []);

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'dark' ? '#90caf9' : '#1976d2',
      },
      secondary: {
        main: mode === 'dark' ? '#f48fb1' : '#dc004e',
      },
      background: {
        default: mode === 'dark' ? '#121212' : '#f5f5f5',
        paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
  }), [mode]);

  const toggleTheme = (newMode) => {
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };

  const contextValue = useMemo(() => ({
    theme,
    toggleTheme,
    mode
  }), [theme, mode]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};