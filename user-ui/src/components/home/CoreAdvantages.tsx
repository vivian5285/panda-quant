import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Container,
  useTheme,
  Card,
  CardContent,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Speed as SpeedIcon,
  Security as SecurityIcon,
  AutoGraph as AutoGraphIcon,
  SupportAgent as SupportIcon,
} from '@mui/icons-material';
import { themeUtils } from '../../theme';

interface Advantage {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  stats: string;
}

const advantages: Advantage[] = [
  {
    id: 1,
    title: '高效交易',
    description: '毫秒级交易执行，把握每一个市场机会',
    icon: <SpeedIcon />,
    color: '#00FFB8',
    stats: '0.001s',
  },
  {
    id: 2,
    title: '安全可靠',
    description: '多重安全防护，保障您的资产安全',
    icon: <SecurityIcon />,
    color: '#00FFB8',
    stats: '99.99%',
  },
  {
    id: 3,
    title: '智能策略',
    description: '基于AI的智能交易策略，持续优化收益',
    icon: <AutoGraphIcon />,
    color: '#00FFB8',
    stats: '50-300%',
  },
  {
    id: 4,
    title: '专业支持',
    description: '7x24小时专业团队支持，随时解决您的问题',
    icon: <SupportIcon />,
    color: '#00FFB8',
    stats: '24/7',
  },
];

const CoreAdvantages = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        overflow: 'hidden',
        bgcolor: '#FFFFFF',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 50% 0%, rgba(0, 255, 184, 0.1) 0%, rgba(0, 255, 184, 0) 50%)',
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: themeUtils.animationConfig.duration.medium }}
        >
          <Typography
            variant="h2"
            sx={{
              color: '#00FFB8',
              fontWeight: 700,
              textAlign: 'center',
              mb: 2,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              lineHeight: 1.2,
              position: 'relative',
              display: 'inline-block',
              left: '50%',
              transform: 'translateX(-50%)',
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
            核心优势
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#666666',
              textAlign: 'center',
              mb: 6,
              fontSize: '1.2rem',
              maxWidth: '800px',
              mx: 'auto',
            }}
          >
            为什么选择我们的量化交易服务
          </Typography>
        </motion.div>

        <Grid container spacing={4}>
          {advantages.map((advantage, index) => (
            <Grid item xs={12} md={6} key={advantage.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: themeUtils.animationConfig.duration.medium,
                  delay: index * themeUtils.animationConfig.delay.small 
                }}
              >
                <Card
                  sx={{
                    height: '100%',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(0, 255, 184, 0.1)',
                    borderRadius: '24px',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(45deg, transparent, rgba(0,255,184,0.05), transparent)',
                      transform: 'translateX(-100%)',
                      transition: 'transform 0.6s ease',
                    },
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 30px rgba(0, 255, 184, 0.15)',
                      border: '1px solid rgba(0, 255, 184, 0.2)',
                      '&::before': {
                        transform: 'translateX(100%)',
                      },
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 3,
                      }}
                    >
                      <Box
                        sx={{
                          width: 64,
                          height: 64,
                          borderRadius: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: 'rgba(0, 255, 184, 0.1)',
                          color: '#00FFB8',
                          mr: 3,
                          position: 'relative',
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            borderRadius: '16px',
                            background: 'radial-gradient(circle, rgba(0,255,184,0.2) 0%, rgba(0,255,184,0) 70%)',
                            animation: 'pulse 3s ease-in-out infinite',
                            '@keyframes pulse': {
                              '0%': { transform: 'scale(1)' },
                              '50%': { transform: 'scale(1.2)' },
                              '100%': { transform: 'scale(1)' },
                            },
                          },
                        }}
                      >
                        {advantage.icon}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="h5"
                          sx={{
                            color: '#333333',
                            fontWeight: 600,
                            mb: 1,
                          }}
                        >
                          {advantage.title}
                        </Typography>
                        <Typography
                          variant="h4"
                          sx={{
                            color: '#00FFB8',
                            fontWeight: 700,
                            background: 'linear-gradient(90deg, #00FFB8, #00B8FF)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }}
                        >
                          {advantage.stats}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#666666',
                        lineHeight: 1.8,
                        position: 'relative',
                        pl: 2,
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          width: '2px',
                          height: '100%',
                          background: 'linear-gradient(to bottom, #00FFB8, transparent)',
                          borderRadius: '1px',
                        },
                      }}
                    >
                      {advantage.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default CoreAdvantages; 