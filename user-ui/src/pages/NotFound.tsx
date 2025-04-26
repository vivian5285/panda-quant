import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        position: 'relative',
        zIndex: 1,
        background: 'transparent'
      }}
    >
      <Typography 
        variant="h1" 
        component="h1" 
        gutterBottom
        sx={{
          fontSize: '8rem',
          fontWeight: 'bold',
          color: 'primary.main',
          opacity: 0.8
        }}
      >
        404
      </Typography>
      <Typography 
        variant="h5" 
        gutterBottom
        sx={{
          mb: 4,
          color: 'text.secondary'
        }}
      >
        {t('pageNotFound')}
      </Typography>
      <Button
        variant="contained"
        onClick={() => navigate('/')}
        sx={{ 
          mt: 2,
          borderRadius: '20px',
          px: 4,
          py: 1.5
        }}
      >
        {t('goHome')}
      </Button>
    </Box>
  );
};

export default NotFound; 