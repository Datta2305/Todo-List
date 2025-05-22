import React, { useContext } from 'react';
import { 
  IconButton,
  Tooltip,
  useTheme
} from '@mui/material';
import { 
  Brightness4, 
  Brightness7,
  SettingsBrightness 
} from '@mui/icons-material';
import { ThemeContext } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const theme = useTheme();
  const { mode, toggleTheme } = useContext(ThemeContext);

  const handleToggle = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    toggleTheme(newMode);
  };

  const handleSystemTheme = () => {
    toggleTheme('system');
  };

  return (
    <>
      <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
        <IconButton 
          color="inherit" 
          onClick={handleToggle}
          sx={{ mr: 1 }}
        >
          {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </Tooltip>
      
      <Tooltip title="Use system theme">
        <IconButton 
          color="inherit" 
          onClick={handleSystemTheme}
        >
          <SettingsBrightness />
        </IconButton>
      </Tooltip>
    </>
  );
};

export default ThemeToggle;