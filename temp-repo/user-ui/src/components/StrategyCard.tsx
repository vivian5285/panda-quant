import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface StrategyCardProps {
  strategy: {
    id: string;
    name: string;
    description: string;
    type: 'quantitative' | 'technical' | 'fundamental';
    status: 'active' | 'inactive' | 'maintenance';
  };
  onSelect: (id: string) => void;
}

const StrategyCard: React.FC<StrategyCardProps> = ({ strategy, onSelect }) => {
  const { t } = useTranslation();

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
          {strategy.description}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            {t(`strategyType.${strategy.type}`)}
          </Typography>
          <Typography 
            variant="caption" 
            sx={{ 
              color: strategy.status === 'active' ? 'success.main' : 
                    strategy.status === 'maintenance' ? 'warning.main' : 'error.main'
            }}
          >
            {t(`strategyStatus.${strategy.status}`)}
          </Typography>
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