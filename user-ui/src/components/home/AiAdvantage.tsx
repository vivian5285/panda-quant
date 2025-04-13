import React from 'react';
import { Box, Container, Grid, Typography, Card, CardContent } from '@mui/material';
import { 
  TrendingUp as TrendingUpIcon,
  History as HistoryIcon,
  AutoGraph as AutoGraphIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';

const advantages = [
  {
    icon: <TrendingUpIcon sx={{ fontSize: 40, color: '#00bfae' }} />,
    title: 'AI 胜率',
    description: '基于深度学习的交易策略,历史胜率超过 85%',
  },
  {
    icon: <HistoryIcon sx={{ fontSize: 40, color: '#00bfae' }} />,
    title: '历史收益',
    description: '过去 12 个月平均月化收益 15%,最大回撤仅 5%',
  },
  {
    icon: <AutoGraphIcon sx={{ fontSize: 40, color: '#00bfae' }} />,
    title: '自动回测',
    description: '实时回测系统,确保策略在实盘前充分验证',
  },
  {
    icon: <AnalyticsIcon sx={{ fontSize: 40, color: '#00bfae' }} />,
    title: '趋势预测',
    description: 'AI 驱动的市场趋势分析,提前捕捉交易机会',
  },
];

const AiAdvantage: React.FC = () => {
  return (
    <Box sx={{ py: 8, bgcolor: '#f8f9fa' }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          component="h2"
          sx={{
            textAlign: 'center',
            mb: 6,
            fontWeight: 'bold',
            color: '#004d2d',
          }}
        >
          AI 量化交易优势
        </Typography>
        <Grid container spacing={4}>
          {advantages.map((advantage, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Box sx={{ mb: 2 }}>{advantage.icon}</Box>
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{ mb: 2, fontWeight: 'bold', color: '#004d2d' }}
                  >
                    {advantage.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {advantage.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default AiAdvantage; 