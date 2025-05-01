import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
} from '@mui/material';
import theme from '../../theme';

interface OrderStatsProps {
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  cancelledOrders: number;
}

const OrderStats: React.FC<OrderStatsProps> = ({
  totalOrders,
  completedOrders,
  pendingOrders,
  cancelledOrders,
}) => {
  const stats = [
    {
      label: '总订单数',
      value: totalOrders,
      color: theme.palette.primary.main,
    },
    {
      label: '已完成订单',
      value: completedOrders,
      color: theme.palette.success.main,
    },
    {
      label: '待处理订单',
      value: pendingOrders,
      color: theme.palette.warning.main,
    },
    {
      label: '已取消订单',
      value: cancelledOrders,
      color: theme.palette.error.main,
    },
  ];

  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: theme.shadows[1],
        '&:hover': {
          boxShadow: theme.shadows[2],
        },
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 600,
          }}
        >
          订单统计
        </Typography>
        <Grid container spacing={3}>
          {stats.map((stat) => (
            <Grid item xs={12} sm={6} md={3} key={stat.label}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 1,
                  backgroundColor: theme.palette.background.paper,
                }}
              >
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  sx={{ mb: 1 }}
                >
                  {stat.label}
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    color: stat.color,
                    fontWeight: 700,
                    mb: 2,
                  }}
                >
                  {stat.value}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(stat.value / totalOrders) * 100}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: theme.palette.background.default,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: stat.color,
                    },
                  }}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default OrderStats; 