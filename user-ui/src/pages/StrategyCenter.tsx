import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const StrategyCenter: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateStrategy = () => {
    setLoading(true);
    try {
      navigate('/strategies/create');
    } catch (err) {
      setError(t('strategy.error.create'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t('strategy.title')}
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('strategy.create.title')}
            </Typography>
            <Typography variant="body1" paragraph>
              {t('strategy.create.description')}
            </Typography>
            <Button
              variant="contained"
              onClick={handleCreateStrategy}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {t('strategy.create.button')}
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('strategy.existing.title')}
            </Typography>
            <Typography variant="body1" paragraph>
              {t('strategy.existing.description')}
            </Typography>
            <Button
              variant="outlined"
              onClick={() => navigate('/strategies/list')}
            >
              {t('strategy.existing.button')}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StrategyCenter; 