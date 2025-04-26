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
      }}
    >
      <Typography variant="h1" component="h1" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" gutterBottom>
        {t('pageNotFound')}
      </Typography>
      <Button
        variant="contained"
        onClick={() => navigate('/')}
        sx={{ mt: 2 }}
      >
        {t('goHome')}
      </Button>
    </Box>
  );
};

export default NotFound; 