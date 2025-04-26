import React from 'react';
import {
  Box,
  Typography,
  Container,
  useTheme,
  Card,
  CardContent,
  Chip,
  Grid,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  TrendingUp as TrendIcon,
  AutoGraph as AutoIcon,
  Psychology as PsychologyIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';

interface Strategy {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  features: string[];
  performance: string;
}

const strategies: Strategy[] = [
  {
    id: 1,
    title: '趋势跟踪',
    description: '基于市场趋势的智能交易策略，自动识别并跟随市场趋势',
    icon: <TrendIcon />,
    color: '#00FFB8',
    features: ['自动识别趋势', '动态调整仓位', '风险控制'],
    performance: '年化收益 50-100%',
  },
  {
    id: 2,
    title: '网格交易',
    description: '在价格区间内自动买卖，利用市场波动获取收益',
    icon: <AutoIcon />,
    color: '#00FFB8',
    features: ['自动网格布局', '智能止盈止损', '资金管理'],
    performance: '年化收益 30-80%',
  },
  {
    id: 3,
    title: 'AI预测',
    description: '基于深度学习的市场预测模型，提前捕捉市场机会',
    icon: <PsychologyIcon />,
    color: '#00FFB8',
    features: ['深度学习模型', '实时市场分析', '多维度预测'],
    performance: '年化收益 80-150%',
  },
  {
    id: 4,
    title: '套利策略',
    description: '利用市场价差进行套利交易，获取稳定收益',
    icon: <SecurityIcon />,
    color: '#00FFB8',
    features: ['多市场套利', '低风险交易', '稳定收益'],
    performance: '年化收益 20-50%',
  },
];

const StrategySection = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
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
      <Container 
        maxWidth="lg" 
        sx={{ 
          position: 'relative', 
          zIndex: 1,
          px: { xs: 2, md: 4 }
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
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
            交易策略
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
            多种智能交易策略，满足不同投资需求
          </Typography>
        </motion.div>

        <Grid container spacing={4}>
          {strategies.map((strategy, index) => (
            <Grid item xs={12} md={6} key={strategy.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5,
                  delay: index * 0.1
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
                        {strategy.icon}
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
                          {strategy.title}
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
                          {strategy.performance}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#666666',
                        lineHeight: 1.8,
                        mb: 3,
                      }}
                    >
                      {strategy.description}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 1,
                      }}
                    >
                      {strategy.features.map((feature, index) => (
                        <Chip
                          key={index}
                          label={feature}
                          sx={{
                            bgcolor: 'rgba(0, 255, 184, 0.1)',
                            color: '#00FFB8',
                            fontWeight: 500,
                            '&:hover': {
                              bgcolor: 'rgba(0, 255, 184, 0.2)',
                            },
                          }}
                        />
                      ))}
                    </Box>
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

export default StrategySection; 