import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Button, List, ListItem, ListItemIcon } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import { GradientTitle } from '@/components/common/GradientTitle';
import PandaCard from '@/components/common/PandaCard';

const ApiPage: React.FC = () => {
  const features = [
    {
      icon: <CodeIcon />,
      title: 'API文档',
      description: '详细的API文档，支持多种编程语言',
    },
    {
      icon: <SecurityIcon />,
      title: '安全认证',
      description: '多重安全认证机制，保障API调用安全',
    },
    {
      icon: <SpeedIcon />,
      title: '高性能',
      description: '低延迟、高并发的API服务',
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
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <GradientTitle variant="h2" align="center" sx={{ mb: 6 }}>
          API 服务
        </GradientTitle>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <PandaCard>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {feature.icon}
                    </ListItemIcon>
                    <Typography variant="h5" component="h3">
                      {feature.title}
                    </Typography>
                  </Box>
                  <Typography color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
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
    </Box>
  );
};

export default ApiPage; 