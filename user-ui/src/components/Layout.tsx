import React from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { MobileMenu } from './MobileMenu';
import { Header } from './Header';
import { useTheme as useAppTheme } from './ThemeProvider';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  const { mode } = useAppTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: mode === 'dark' ? 'background.default' : 'background.paper',
      }}
    >
      <Header />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: isMobile ? 2 : 3,
          pt: { xs: '64px', sm: '64px' },
          pb: isMobile ? 8 : 3,
        }}
      >
        {children}
      </Box>
      {isMobile && <MobileMenu />}
    </Box>
  );
}; 