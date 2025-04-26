import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { StrategyStats } from '../types/strategy';

interface BacktestResultsProps {
  result: StrategyStats;
}

const BacktestResults: React.FC<BacktestResultsProps> = ({ result }) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        {t('backtestResults')}
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              {t('totalTrades')}: {result.totalTrades}
            </Typography>
            <Typography variant="subtitle1">
              {t('winRate')}: {(result.winRate * 100).toFixed(2)}%
            </Typography>
            <Typography variant="subtitle1">
              {t('profitFactor')}: {result.profitFactor.toFixed(2)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              {t('totalProfit')}: {result.totalProfit.toFixed(2)}%
            </Typography>
            <Typography variant="subtitle1">
              {t('maxDrawdown')}: {result.maxDrawdown.toFixed(2)}%
            </Typography>
            <Typography variant="subtitle1">
              {t('sharpeRatio')}: {result.sharpeRatio.toFixed(2)}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default BacktestResults; 