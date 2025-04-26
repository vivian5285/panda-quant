import React from 'react';
import {
  Box,
  Typography,
  Container,
  Button,
  useTheme,
  Grid,
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  ArrowForward as ArrowForwardIcon,
  Security as SecurityIcon,
  AutoGraph as AutoGraphIcon,
  Psychology as PsychologyIcon,
} from '@mui/icons-material';
import { themeUtils } from '../../theme';

const HeroSection = () => {
  const theme = useTheme();

  const advantages = [
    {
      title: 'AI 智能交易',
      description: '基于深度学习的智能交易系统，24小时自动运行，月化收益可达50%-300%。采用先进的机器学习算法，实时分析市场数据，自动调整交易策略，让您的投资更智能、更高效。',
      icon: <PsychologyIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
    },
    {
      title: '量化策略',
      description: '剥头皮、超级趋势、网格套利等多策略组合，专业团队持续优化，风险分散，稳定收益。每个策略都经过严格回测和实盘验证，确保在不同市场环境下都能获得稳定收益。',
      icon: <AutoGraphIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
    },
    {
      title: '安全保障',
      description: '银行级安全防护，API只读授权，资金隔离，多重风控，确保资产安全无忧。采用多重加密技术，实时监控交易风险，为您的投资保驾护航。',
      icon: <SecurityIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
    },
  ];

  // 生成随机K线数据
  const generateKLineData = () => {
    const data = [];
    let lastClose = 200;
    for (let i = 0; i < 20; i++) {
      const open = lastClose;
      const high = open + Math.random() * 20;
      const low = open - Math.random() * 20;
      const close = low + Math.random() * (high - low);
      lastClose = close;
      data.push({ open, high, low, close });
    }
    return data;
  };

  const kLineData = generateKLineData();

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
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6} sx={{ pl: { xs: 0, md: 4 } }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8,
                ease: [0.6, -0.05, 0.01, 0.99]
              }}
            >
              <Typography
                variant="h1"
                sx={{
                  color: '#00FFB8',
                  fontWeight: 800,
                  mb: 3,
                  fontSize: { xs: '3.5rem', md: '5rem' },
                  lineHeight: 1.1,
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -12,
                    left: 0,
                    width: '120px',
                    height: '4px',
                    background: 'linear-gradient(90deg, #00FFB8, transparent)',
                    borderRadius: '2px',
                  },
                }}
              >
                熊猫量化
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  color: '#333333',
                  fontWeight: 700,
                  mb: 4,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  lineHeight: 1.2,
                }}
              >
                让投资更简单
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#666666',
                  mb: 6,
                  fontSize: '1.25rem',
                  maxWidth: '600px',
                  lineHeight: 1.8,
                  position: 'relative',
                  pl: 3,
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '4px',
                    height: '100%',
                    background: 'linear-gradient(to bottom, #00FFB8, transparent)',
                    borderRadius: '2px',
                  },
                }}
              >
                基于先进AI技术，为您提供专业的量化交易策略和实时市场分析，让您的投资更智能、更高效。
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  gap: 3,
                  flexDirection: { xs: 'column', sm: 'row' },
                }}
              >
                <motion.div
                  whileHover={{ 
                    scale: 1.05,
                    y: -5,
                    transition: {
                      duration: 0.3,
                      ease: "easeOut"
                    }
                  }}
                  whileTap={{ 
                    scale: 0.95,
                    transition: {
                      duration: 0.1
                    }
                  }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      bgcolor: '#00FFB8',
                      color: '#000000',
                      py: 2,
                      px: 4,
                      fontSize: '1.1rem',
                      borderRadius: 3,
                      position: 'relative',
                      overflow: 'hidden',
                      fontWeight: 600,
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.2), transparent)',
                        transform: 'translateX(-100%)',
                        transition: 'transform 0.6s ease',
                      },
                      '&:hover': {
                        bgcolor: '#00CC93',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 10px 20px rgba(0, 255, 184, 0.2)',
                        '&::before': {
                          transform: 'translateX(100%)',
                        },
                      },
                    }}
                  >
                    立即开始
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ 
                    scale: 1.05,
                    y: -5,
                    transition: {
                      duration: 0.3,
                      ease: "easeOut"
                    }
                  }}
                  whileTap={{ 
                    scale: 0.95,
                    transition: {
                      duration: 0.1
                    }
                  }}
                >
                  <Button
                    variant="outlined"
                    size="large"
                    sx={{
                      borderColor: '#00FFB8',
                      color: '#00FFB8',
                      py: 2,
                      px: 4,
                      fontSize: '1.1rem',
                      borderRadius: 3,
                      position: 'relative',
                      overflow: 'hidden',
                      fontWeight: 600,
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(45deg, transparent, rgba(0,255,184,0.1), transparent)',
                        transform: 'translateX(-100%)',
                        transition: 'transform 0.6s ease',
                      },
                      '&:hover': {
                        borderColor: '#00CC93',
                        bgcolor: 'rgba(0, 255, 184, 0.1)',
                        transform: 'translateY(-2px)',
                        '&::before': {
                          transform: 'translateX(100%)',
                        },
                      },
                    }}
                  >
                    了解更多
                  </Button>
                </motion.div>
              </Box>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6} sx={{ pr: { xs: 0, md: 4 } }}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                duration: 0.8,
                ease: [0.6, -0.05, 0.01, 0.99]
              }}
            >
              <Card
                sx={{
                  position: 'relative',
                  width: { xs: '100%', md: '90%' },
                  height: { xs: '300px', md: '400px' },
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                  border: '1px solid rgba(0, 255, 184, 0.1)',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(0, 255, 184, 0.1) 0%, rgba(0, 255, 184, 0.05) 100%)',
                    animation: 'pulse 3s ease-in-out infinite',
                    '@keyframes pulse': {
                      '0%': { opacity: 0.5 },
                      '50%': { opacity: 0.8 },
                      '100%': { opacity: 0.5 },
                    },
                  },
                }}
              >
                <CardContent sx={{ p: 0, height: '100%' }}>
                  <Box
                    component="svg"
                    viewBox="0 0 400 300"
                    sx={{
                      width: '100%',
                      height: '100%',
                      '& .grid': {
                        stroke: 'rgba(0, 255, 184, 0.1)',
                        strokeWidth: 1,
                      },
                      '& .candle': {
                        stroke: '#00FFB8',
                        strokeWidth: 2,
                        fill: 'none',
                        animation: 'drawCandle 4s ease-in-out infinite',
                      },
                      '& .line': {
                        stroke: '#00FFB8',
                        strokeWidth: 2,
                        fill: 'none',
                        strokeDasharray: 1000,
                        strokeDashoffset: 1000,
                        animation: 'drawLine 6s ease-in-out infinite',
                      },
                      '@keyframes drawLine': {
                        '0%': { strokeDashoffset: 1000 },
                        '100%': { strokeDashoffset: 0 },
                      },
                      '@keyframes drawCandle': {
                        '0%': { opacity: 0 },
                        '50%': { opacity: 1 },
                        '100%': { opacity: 0 },
                      },
                    }}
                  >
                    <g className="grid">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <line
                          key={`h-${i}`}
                          x1="0"
                          y1={i * 60}
                          x2="400"
                          y2={i * 60}
                        />
                      ))}
                      {Array.from({ length: 8 }).map((_, i) => (
                        <line
                          key={`v-${i}`}
                          x1={i * 50}
                          y1="0"
                          x2={i * 50}
                          y2="300"
                        />
                      ))}
                    </g>
                    <g className="candle">
                      {kLineData.map((candle, i) => (
                        <g key={i} style={{ animationDelay: `${i * 0.2}s` }}>
                          <line
                            x1={i * 20 + 10}
                            y1={candle.low}
                            x2={i * 20 + 10}
                            y2={candle.high}
                          />
                          <rect
                            x={i * 20 + 5}
                            y={Math.min(candle.open, candle.close)}
                            width="10"
                            height={Math.abs(candle.close - candle.open)}
                            fill={candle.close > candle.open ? '#00FFB8' : '#FF4D4D'}
                          />
                        </g>
                      ))}
                    </g>
                    <path
                      className="line"
                      d="M50,200 C100,150 150,250 200,180 C250,110 300,220 350,150"
                    />
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        <Grid 
          container 
          spacing={4} 
          sx={{ 
            mt: { xs: 8, md: 10 }
          }}
        >
          {advantages.map((advantage, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.8,
                  delay: index * 0.2,
                  ease: [0.6, -0.05, 0.01, 0.99]
                }}
              >
                <Card
                  sx={{
                    height: { xs: 'auto', md: '280px' },
                    minHeight: { xs: '240px', md: '280px' },
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(0, 255, 184, 0.1)',
                    borderRadius: '16px',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
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
                  <CardContent sx={{ 
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                    <Box>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mb: 2,
                        }}
                      >
                        <Box
                          sx={{
                            width: 60,
                            height: 60,
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: 'rgba(0, 255, 184, 0.1)',
                            mr: 2,
                          }}
                        >
                          {advantage.icon}
                        </Box>
                        <Typography
                          variant="h5"
                          sx={{
                            color: '#333333',
                            fontWeight: 600,
                          }}
                        >
                          {advantage.title}
                        </Typography>
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

export default HeroSection; 