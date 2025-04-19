import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { ThemeProvider as MUIThemeProvider, createTheme, Theme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

export const useTheme = useThemeContext;

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? 'dark' : 'light',
          primary: {
            main: '#1976d2',
          },
          secondary: {
            main: '#dc004e',
          },
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                scrollbarColor: isDarkMode ? '#6b6b6b #2b2b2b' : '#6b6b6b #f1f1f1',
                '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
                  backgroundColor: isDarkMode ? '#2b2b2b' : '#f1f1f1',
                },
                '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
                  borderRadius: 8,
                  backgroundColor: '#6b6b6b',
                  minHeight: 24,
                  border: isDarkMode ? '1px solid #2b2b2b' : '1px solid #f1f1f1',
                },
              },
            },
          },
        },
      }),
    [isDarkMode]
  );

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
      isDarkMode,
    }),
    [theme, isDarkMode]
  );

  return (
    <ThemeContext.Provider value={value}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider; 