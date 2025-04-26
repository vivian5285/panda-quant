import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';
import './i18n';
import { CircularProgress, Box } from '@mui/material';

const LoadingFallback = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}
  >
    <CircularProgress />
  </Box>
);

const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element');
const root = createRoot(container);

const AppWrapper = () => {
  if (process.env.NODE_ENV === 'development') {
    return (
      <React.StrictMode>
        <Suspense fallback={<LoadingFallback />}>
          <App />
        </Suspense>
      </React.StrictMode>
    );
  }
  
  return (
    <Suspense fallback={<LoadingFallback />}>
      <App />
    </Suspense>
  );
};

root.render(<AppWrapper />);

reportWebVitals(); 