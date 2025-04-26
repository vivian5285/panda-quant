import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Container,
  useTheme,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  AccountCircle as AccountIcon,
  AddCircle as AddIcon,
  Settings as SettingsIcon,
  PlayCircle as PlayIcon,
} from '@mui/icons-material';
import { themeUtils } from '../../theme';

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  time: string;
}

const steps: Step[] = [
  {
    id: 1,
    title: '注册账号',
    description: '快速注册，立即开始您的量化交易之旅',
    icon: <AccountIcon />,
    color: '#00FFB8',
    time: '1分钟',
  },
  {
    id: 2,
    title: '创建策略',
    description: '选择或自定义您的交易策略，设置参数',
    icon: <AddIcon />,
    color: '#00FFB8',
    time: '5分钟',
  },
  {
    id: 3,
    title: '配置账户',
    description: '连接您的交易账户，设置风险控制',
    icon: <SettingsIcon />,
    color: '#00FFB8',
    time: '3分钟',
  },
  {
    id: 4,
    title: '开始交易',
    description: '一键启动，让AI为您自动执行交易',
    icon: <PlayIcon />,
    color: '#00FFB8',
    time: '立即开始',
  },
];

const HowItWorks = () => {
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
          background: 'linear-gradient(135deg, rgba(0, 255, 184, 0.05) 0%, rgba(0, 255, 184, 0.02) 100%)',
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
            使用流程
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
            简单四步，开启您的量化交易之旅
          </Typography>
        </motion.div>

        <Box
          sx={{
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '2px',
              height: '100%',
              background: 'linear-gradient(to bottom, #00FFB8, transparent)',
              zIndex: 0,
            },
          }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                duration: themeUtils.animationConfig.duration.medium,
                delay: index * themeUtils.animationConfig.delay.small 
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 4,
                  position: 'relative',
                  '&:last-child': {
                    mb: 0,
                  },
                }}
              >
                <Box
                  sx={{
                    width: '50%',
                    order: index % 2 === 0 ? 1 : 2,
                    pr: index % 2 === 0 ? 4 : 0,
                    pl: index % 2 === 0 ? 0 : 4,
                  }}
                >
                  <Card
                    sx={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                      border: '1px solid rgba(0, 255, 184, 0.1)',
                      borderRadius: '24px',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 8px 30px rgba(0, 255, 184, 0.15)',
                        border: '1px solid rgba(0, 255, 184, 0.2)',
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
                          {step.icon}
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
                            {step.title}
                          </Typography>
                          <Typography
                            variant="h6"
                            sx={{
                              color: '#00FFB8',
                              fontWeight: 700,
                              background: 'linear-gradient(90deg, #00FFB8, #00B8FF)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                            }}
                          >
                            预计时间：{step.time}
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
                        {step.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
                <Box
                  sx={{
                    width: '50%',
                    order: index % 2 === 0 ? 2 : 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: '#00FFB8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      fontWeight: 700,
                      fontSize: '1.2rem',
                      boxShadow: '0 4px 20px rgba(0, 255, 184, 0.3)',
                    }}
                  >
                    {step.id}
                  </Box>
                </Box>
              </Box>
            </motion.div>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default HowItWorks; 