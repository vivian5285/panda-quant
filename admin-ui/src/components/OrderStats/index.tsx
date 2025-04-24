import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as AttachMoneyIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import { StyledCard, StyledBox, StyledTypography } from '../common/StyledComponents';
import { themeUtils } from '../../theme';

interface OrderStatsProps {
  totalOrders: number;
  successRate: number;
  averageProfit: number;
  totalVolume: number;
}

const OrderStats: React.FC<OrderStatsProps> = ({
  totalOrders,
  successRate,
  averageProfit,
  totalVolume,
}) => {
  const stats = [
    {
      title: '总订单数',
      value: totalOrders,
      icon: <TimelineIcon sx={{ fontSize: 40, color: themeUtils.palette.primary.main }} />,
      color: themeUtils.palette.primary.main,
    },
    {
      title: '成功率',
      value: `${(successRate * 100).toFixed(1)}%`,
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: themeUtils.palette.success.main }} />,
      color: themeUtils.palette.success.main,
    },
    {
      title: '平均收益',
      value: `${averageProfit.toFixed(2)}%`,
      icon: <AttachMoneyIcon sx={{ fontSize: 40, color: themeUtils.palette.warning.main }} />,
      color: themeUtils.palette.warning.main,
    },
    {
      title: '总交易量',
      value: `$${totalVolume.toLocaleString()}`,
      icon: <TrendingDownIcon sx={{ fontSize: 40, color: themeUtils.palette.error.main }} />,
      color: themeUtils.palette.error.main,
    },
  ];

  return (
    <Grid container spacing={3}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <StyledCard>
            <StyledBox>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {stat.icon}
                <StyledTypography variant="h6" sx={{ ml: 2 }}>
                  {stat.title}
                </StyledTypography>
              </Box>
              <StyledTypography variant="h4" sx={{ mb: 1 }}>
                {stat.value}
              </StyledTypography>
              <LinearProgress
                variant="determinate"
                value={100}
                sx={{
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: `${stat.color}20`,
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: stat.color,
                  },
                }}
              />
            </StyledBox>
          </StyledCard>
        </Grid>
      ))}
    </Grid>
  );
};

export default OrderStats; 