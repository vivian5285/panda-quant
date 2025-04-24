import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Button, List, ListItem, ListItemIcon } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import SecurityIcon from '@mui/icons-material/Security';
import GlobalBackground from '@/components/common/GlobalBackground';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import GradientTitle from '@/components/common/GradientTitle';
import PandaCard from '@/components/common/PandaCard';

const QuantPage: React.FC = () => {
  const features = [
    {
      icon: <TrendingUpIcon />,
      title: '智能策略',
      description: '基于机器学习和深度学习的量化交易策略，自动适应市场变化。',
    },
    {
      icon: <AutoGraphIcon />,
      title: '回测系统',
      description: '强大的回测引擎，支持多周期、多品种、多策略的回测分析。',
    },
    {
      icon: <SecurityIcon />,
      title: '风险控制',
      description: '多层次风险控制体系，实时监控和预警，保护您的资金安全。',
    },
  ];

  const strategies = [
    {
      name: '趋势跟踪',
      description: '基于技术指标的 trend following 策略，适合趋势明显的市场。',
      performance: '+15.2%',
      risk: '中等',
    },
    {
      name: '均值回归',
      description: '利用价格偏离均值的特性进行交易，适合震荡市场。',
      performance: '+12.8%',
      risk: '低',
    },
    {
      name: '套利策略',
      description: '利用市场价差进行套利交易，风险较低，收益稳定。',
      performance: '+8.5%',
      risk: '低',
    },
  ];

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <GlobalBackground />
      <Navbar />
      
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <GradientTitle>
            量化交易
          </GradientTitle>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
            智能交易，让投资更简单
          </Typography>
        </Box>
        
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <PandaCard>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Box sx={{ mb: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </PandaCard>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" gutterBottom>
            策略展示
          </Typography>
          <Grid container spacing={4}>
            {strategies.map((strategy, index) => (
              <Grid item xs={12} md={4} key={index}>
                <PandaCard>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {strategy.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {strategy.description}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">
                          年化收益：{strategy.performance}
                        </Typography>
                        <Typography variant="body2">
                          风险等级：{strategy.risk}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </PandaCard>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            sx={{
              bgcolor: '#00FFB8',
              color: 'white',
              '&:hover': {
                bgcolor: '#00E6A5',
              },
            }}
          >
            了解更多策略
          </Button>
        </Box>
      </Container>

      <Footer />
    </Box>
  );
};

export default QuantPage; 