import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { 
  Cloud as CloudIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';

const hostingOptions = [
  {
    icon: <CloudIcon sx={{ fontSize: 40, color: '#00bfae' }} />,
    title: '云服务器托管',
    description: '使用高性能云服务器,确保交易系统稳定运行',
    features: [
      '99.9% 运行时间保证',
      '全球多个数据中心',
      '自动备份和恢复',
    ],
    price: '$50/月',
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 40, color: '#00bfae' }} />,
    title: '独立服务器托管',
    description: '专属物理服务器,提供最高级别的安全性和性能',
    features: [
      '100% 独立资源',
      '企业级安全防护',
      '24/7 技术支持',
    ],
    price: '$200/月',
  },
  {
    icon: <SpeedIcon sx={{ fontSize: 40, color: '#00bfae' }} />,
    title: '高频交易托管',
    description: '专为高频交易优化的托管方案,提供最低延迟',
    features: [
      '超低延迟网络',
      '专用交易通道',
      '实时监控系统',
    ],
    price: '$500/月',
  },
];

const HostingIntro: React.FC = () => {
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
          托管方案
        </Typography>
        <Grid container spacing={4}>
          {hostingOptions.map((option, index) => (
            <Grid item xs={12} md={4} key={index}>
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
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ textAlign: 'center', mb: 2 }}>
                    {option.icon}
                  </Box>
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{ mb: 2, fontWeight: 'bold', color: '#004d2d' }}
                  >
                    {option.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    {option.description}
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    {option.features.map((feature, i) => (
                      <Typography
                        key={i}
                        variant="body2"
                        sx={{ mb: 1, display: 'flex', alignItems: 'center' }}
                      >
                        <Box
                          component="span"
                          sx={{
                            width: 8,
                            height: 8,
                            bgcolor: '#00bfae',
                            borderRadius: '50%',
                            mr: 1,
                          }}
                        />
                        {feature}
                      </Typography>
                    ))}
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      textAlign: 'center',
                      color: '#00bfae',
                      fontWeight: 'bold',
                      mb: 2,
                    }}
                  >
                    {option.price}
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      bgcolor: '#00bfae',
                      '&:hover': {
                        bgcolor: '#009688',
                      },
                    }}
                  >
                    立即购买
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default HostingIntro; 