import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import GlobalBackground from './GlobalBackground';

interface ResourceLayoutProps {
  children?: React.ReactNode;
}

const ResourceLayout: React.FC<ResourceLayoutProps> = () => {
  return (
    <Box sx={{ 
      position: 'relative', 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <GlobalBackground />
      <Navbar />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          zIndex: 1,
          overflow: 'auto'
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default ResourceLayout; 