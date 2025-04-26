import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Web3Provider } from './contexts/Web3Context';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { BackgroundProvider } from './contexts/BackgroundContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { routes } from './config/routes';
import { Box, CircularProgress } from '@mui/material';

const LoadingSpinner = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100vw',
      position: 'fixed',
      top: 0,
      left: 0,
      backgroundColor: 'background.default',
      zIndex: 9999,
    }}
  >
    <CircularProgress />
  </Box>
);

// Create router instance with future flags
const router = createBrowserRouter(routes, {
  future: {
    v7_normalizeFormMethod: true
  },
  basename: '/',
});

const App: React.FC = () => {
  console.log('App rendered');
  console.log('Routes:', routes);

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <BackgroundProvider>
          <Web3Provider>
            <AuthProvider>
              <NotificationProvider>
                <RouterProvider 
                  router={router}
                  fallbackElement={<LoadingSpinner />}
                />
              </NotificationProvider>
            </AuthProvider>
          </Web3Provider>
        </BackgroundProvider>
      </ThemeProvider>
    </I18nextProvider>
  );
};

export default App; 