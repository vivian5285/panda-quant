import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Button, List, ListItem, ListItemIcon } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import GlobalBackground from '@/components/common/GlobalBackground';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import GradientTitle from '@/components/common/GradientTitle';
import PandaCard from '@/components/common/PandaCard';

const ApiPage: React.FC = () => {
  const features = [
    {
      icon: <CodeIcon />,
      title: '简单易用',
      description: '提供清晰的API文档和示例代码，支持多种编程语言，快速上手。',
    },
    {
      icon: <SecurityIcon />,
      title: '安全可靠',
      description: '采用行业标准的安全协议，多重加密保护，确保数据传输安全。',
    },
    {
      icon: <SpeedIcon />,
      title: '高性能',
      description: '低延迟、高并发的API服务，支持实时数据推送，满足高频交易需求。',
    },
  ];

  const endpoints = [
    {
      method: 'GET',
      path: '/api/v1/market/ticker',
      description: '获取市场行情数据',
    },
    {
      method: 'POST',
      path: '/api/v1/trade/order',
      description: '创建交易订单',
    },
    {
      method: 'GET',
      path: '/api/v1/account/balance',
      description: '查询账户余额',
    },
    {
      method: 'GET',
      path: '/api/v1/strategy/status',
      description: '获取策略运行状态',
    },
  ];

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <GlobalBackground />
      <Navbar />
      
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <GradientTitle>
            API文档
          </GradientTitle>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
            强大的API接口，助力您的交易自动化
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
            主要接口
          </Typography>
          <PandaCard>
            <List>
              {endpoints.map((endpoint, index) => (
                <ListItem key={index} sx={{ display: 'block', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        bgcolor: endpoint.method === 'GET' ? '#00FFB8' : '#FF6B6B',
                        color: 'white',
                        px: 2,
                        py: 0.5,
                        borderRadius: 1,
                        mr: 2,
                      }}
                    >
                      {endpoint.method}
                    </Typography>
                    <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                      {endpoint.path}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {endpoint.description}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </PandaCard>
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
            查看完整API文档
          </Button>
        </Box>
      </Container>

      <Footer />
    </Box>
  );
};

export default ApiPage; 