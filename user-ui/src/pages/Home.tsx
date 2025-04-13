import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Home: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        {t('welcome')}
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        {t('description')}
      </Typography>
      <Button variant="contained" color="primary" sx={{ mt: 2 }}>
        {t('getStarted')}
      </Button>
    </Box>
  );
};

export default Home; 