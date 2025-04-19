import React, { createContext, useContext, useState, useMemo } from 'react';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme as baseTheme } from '../styles/globalStyles';

interface ThemeContextType {
  mode: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<'light' | 'dark'>('dark');

  const theme = useMemo(
    () => ({
      ...baseTheme,
      palette: {
        ...baseTheme.palette,
        mode,
        primary: {
          ...baseTheme.palette.primary,
          main: '#00FFB8',
          light: '#33FFC6',
          dark: '#00B281',
          contrastText: '#000',
        },
        secondary: {
          ...baseTheme.palette.secondary,
          main: '#00B8FF',
          light: '#33C6FF',
          dark: '#0081B2',
          contrastText: '#000',
        },
        background: {
          ...baseTheme.palette.background,
          default: mode === 'dark' ? '#0A0A0A' : '#F5F5F5',
          paper: mode === 'dark' ? '#1A1A1A' : '#FFFFFF',
        },
        text: {
          ...baseTheme.palette.text,
          primary: mode === 'dark' ? '#FFFFFF' : '#000000',
          secondary: mode === 'dark' ? '#B0B0B0' : '#666666',
        },
      },
    }),
    [mode]
  );

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};