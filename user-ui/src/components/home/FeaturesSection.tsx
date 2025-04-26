import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Analytics as AnalyticsIcon,
  AutoGraph as AutoGraphIcon,
  Api as ApiIcon,
  SupportAgent as SupportIcon
} from '@mui/icons-material';

const features = [
  {
    icon: <SpeedIcon sx={{ fontSize: 40 }} />,
    title: '高速交易',
    description: '毫秒级交易执行，把握每一个市场机会'
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 40 }} />,
    title: '安全可靠',
    description: '多重安全防护，保障您的资产安全'
  },
  {
    icon: <AnalyticsIcon sx={{ fontSize: 40 }} />,
    title: '智能分析',
    description: '基于AI的市场分析，提供精准的交易决策'
  },
  {
    icon: <AutoGraphIcon sx={{ fontSize: 40 }} />,
    title: '自动交易',
    description: '24小时自动运行，无需人工干预'
  },
  {
    icon: <ApiIcon sx={{ fontSize: 40 }} />,
    title: 'API集成',
    description: '支持主流交易所API，轻松接入'
  },
  {
    icon: <SupportIcon sx={{ fontSize: 40 }} />,
    title: '专业支持',
    description: '7x24小时专业团队支持，随时解决您的问题'
  }
];

const FeaturesSection: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        py: { xs: 8, md: 12 },
        position: 'relative',
        overflow: 'hidden',
        bgcolor: '#FFFFFF',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(0, 255, 184, 0.05) 0%, rgba(0, 255, 184, 0.02) 100%)',
          zIndex: 0,
        },
      }}
    >
      <Container 
        maxWidth="lg" 
        sx={{ 
          position: 'relative', 
          zIndex: 1,
          px: { xs: 2, md: 4 }
        }}
      >
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          sx={{ textAlign: 'center', mb: 8 }}
        >
          <Typography
            variant="h2"
            component="h2"
            gutterBottom
            sx={{
              color: '#00FFB8',
              fontWeight: 700,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              lineHeight: 1.2,
              position: 'relative',
              display: 'inline-block',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -10,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80px',
                height: '4px',
                background: 'linear-gradient(90deg, transparent, #00FFB8, transparent)',
                borderRadius: '2px',
              },
            }}
          >
            核心功能
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              maxWidth: '800px',
              mx: 'auto',
              opacity: 0.8
            }}
          >
            为您提供全方位的量化交易解决方案
          </Typography>
        </Box>

        <Grid container spacing={2}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                sx={{ height: '100%' }}
              >
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(0, 255, 184, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 30px rgba(0, 255, 184, 0.15)',
                      border: '1px solid rgba(0, 255, 184, 0.2)',
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      p: 3,
                      height: '100%',
                      minHeight: '240px',
                    }}
                  >
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'rgba(0, 255, 184, 0.1)',
                        borderRadius: '16px',
                        mb: 2,
                        color: '#00FFB8',
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography
                      variant="h5"
                      component="h3"
                      gutterBottom
                      sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                        mb: 1.5,
                        fontSize: { xs: '1.1rem', md: '1.25rem' },
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{
                        opacity: 0.8,
                        lineHeight: 1.5,
                        fontSize: { xs: '0.9rem', md: '0.95rem' },
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturesSection; 