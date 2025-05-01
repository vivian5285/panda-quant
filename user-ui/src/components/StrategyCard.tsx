import React from 'react';
import { Card, CardContent, Typography, Button, Box, Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import { Strategy as StrategyType } from '../types/strategy';
import { Strategy as ServiceStrategy } from '../services/strategyService';

type Strategy = StrategyType & ServiceStrategy & {
  description?: string;
};

interface StrategyCardProps {
  strategy: Strategy;
  onSelect: (id: string) => void;
}

const StrategyCard: React.FC<StrategyCardProps> = ({ strategy, onSelect }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          boxShadow: 6,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>
          {strategy.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {strategy.description || t('strategy.noDescription')}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="body2" sx={{ mr: 2 }}>
            {t(`strategyType.${strategy.type}`)}
          </Typography>
          <Chip
            label={t(`strategyStatus.${strategy.status}`)}
            size="small"
            sx={{
              backgroundColor: strategy.status === 'active' ? 'success.main' :
                strategy.status === 'paused' ? 'warning.main' : 'error.main',
              color: 'white'
            }}
          />
        </Box>
      </CardContent>
      <Box sx={{ p: 2 }}>
        <Button
          variant="contained"
          fullWidth
          onClick={() => onSelect(strategy.id)}
          disabled={strategy.status !== 'active'}
        >
          {t('strategy.select')}
        </Button>
      </Box>
    </Card>
  );
};

export default StrategyCard; 