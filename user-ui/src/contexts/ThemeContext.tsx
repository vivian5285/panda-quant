import React, { createContext, useContext, useState, useMemo, Component, ErrorInfo, ReactNode } from 'react';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createCustomTheme } from '../theme';

interface ThemeContextType {
  mode: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ThemeProvider Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: 'red' }}>
          <h2>Something went wrong in ThemeProvider</h2>
          <pre>{this.state.error?.toString()}</pre>
        </div>
      );
    }

    return this.props.children;
  }
}

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  const theme = useMemo(() => {
    try {
      console.log('Creating theme with mode:', mode);
      const newTheme = createCustomTheme(mode);
      console.log('Theme created successfully:', {
        palette: newTheme.palette,
        typography: newTheme.typography,
        transitions: newTheme.transitions,
        components: Object.keys(newTheme.components || {})
      });
      return newTheme;
    } catch (error) {
      console.error('Error creating theme:', error);
      // 返回一个基本的主题作为后备
      return createCustomTheme('light');
    }
  }, [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const value = useMemo(() => ({ mode, toggleTheme }), [mode]);

  return (
    <ErrorBoundary>
      <ThemeContext.Provider value={value}>
        <MUIThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </MUIThemeProvider>
      </ThemeContext.Provider>
    </ErrorBoundary>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};