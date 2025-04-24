import React from 'react';
import { CssBaseline } from '@mui/material';
import { Web3Provider } from './contexts/Web3Context';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { Router } from './config/router';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <CssBaseline />
      <Web3Provider>
        <AuthProvider>
          <I18nextProvider i18n={i18n}>
            <Router />
          </I18nextProvider>
        </AuthProvider>
      </Web3Provider>
    </ThemeProvider>
  );
};

export default App; 