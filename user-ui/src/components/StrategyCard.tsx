import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Stack,
  Divider,
  LinearProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningIcon from '@mui/icons-material/Warning';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import { getExpectedMonthlyReturn } from '../../strategy-engine/runner/strategyRunner';

interface StrategyCardProps {
  strategy: {
    _id: string;
    name: string;
    description: string;
    riskLevel: 'high' | 'medium' | 'low';
    active: boolean;
  };
  onStatusChange: (strategyId: string, active: boolean) => void;
  onSelect: () => void;
}

const StrategyCard: React.FC<StrategyCardProps> = ({ strategy, onStatusChange, onSelect }) => {
  const expectedReturn = getExpectedMonthlyReturn(strategy.name, strategy.riskLevel);
  
  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };
  
  const getRiskLevelText = (level: string) => {
    switch (level) {
      case 'high':
        return '高风险';
      case 'medium':
        return '中风险';
      case 'low':
        return '低风险';
      default:
        return level;
    }
  };

  const handleStatusChange = () => {
    onStatusChange(strategy._id, !strategy.active);
  };

  return (
    <Card
      sx={{
        cursor: 'pointer',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.02)',
        },
      }}
      onClick={onSelect}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="div">
            {strategy.name}
          </Typography>
          <Tooltip title={strategy.active ? '停止策略' : '启动策略'}>
            <IconButton onClick={handleStatusChange} size="small">
              {strategy.active ? <StopCircleIcon color="error" /> : <PlayCircleIcon color="success" />}
            </IconButton>
          </Tooltip>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {strategy.description}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={2}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="body2">
                预期收益: {expectedReturn}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={Math.min(expectedReturn, 100)} 
              color={getRiskLevelColor(strategy.riskLevel) as any}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <WarningIcon 
              color={getRiskLevelColor(strategy.riskLevel) as any} 
              sx={{ mr: 1 }} 
            />
            <Typography variant="body2">
              风险等级: {getRiskLevelText(strategy.riskLevel)}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default StrategyCard; 