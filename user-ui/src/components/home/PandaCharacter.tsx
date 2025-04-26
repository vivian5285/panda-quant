import React from 'react';
import {
  Box,
  Typography,
  Container,
  useTheme,
  Card,
  CardContent,
  Grid,
  Avatar,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  TrendingUp as TrendIcon,
  AutoGraph as AutoIcon,
  Psychology as PsychologyIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';

const PandaCharacter = () => {
  const theme = useTheme();

  const features = [
    {
      title: '24小时智能交易',
      description: '全天候自动运行，实时监控市场动态，把握每一个交易机会',
      icon: '🔄',
    },
    {
      title: '多重风控保障',
      description: '严格的风险控制系统，确保您的投资安全无忧',
      icon: '🛡️',
    },
    {
      title: 'AI智能分析',
      description: '基于深度学习的市场分析，提供精准的交易决策支持',
      icon: '🧠',
    },
  ];

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
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            mb: { xs: 4, md: 6 },
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box
              sx={{
                position: 'relative',
                mb: 4,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '300px',
                  height: '300px',
                  background: 'radial-gradient(circle, rgba(0,255,184,0.2) 0%, rgba(0,255,184,0) 70%)',
                  animation: 'pulse 3s ease-in-out infinite',
                  '@keyframes pulse': {
                    '0%': { transform: 'translate(-50%, -50%) scale(1)' },
                    '50%': { transform: 'translate(-50%, -50%) scale(1.2)' },
                    '100%': { transform: 'translate(-50%, -50%) scale(1)' },
                  },
                },
              }}
            >
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: '8rem', md: '12rem' },
                    lineHeight: 1,
                  }}
                >
                  🐼
                </Typography>
              </motion.div>
            </Box>
          </motion.div>

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
                mb: 2,
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
              熊猫助手
            </Typography>
            <Typography
              variant="h3"
              sx={{
                color: '#333333',
                fontWeight: 700,
                mb: 3,
                fontSize: { xs: '1.8rem', md: '2.5rem' },
                lineHeight: 1.2,
              }}
            >
              您的智能量化交易伙伴
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#666666',
                mb: 4,
                fontSize: '1.2rem',
                maxWidth: '800px',
                mx: 'auto',
              }}
            >
              基于先进AI技术，为您提供专业的量化交易策略和实时市场分析，让您的投资更智能、更高效。
            </Typography>
          </motion.div>
        </Box>

        <Grid container spacing={3} sx={{ mt: { xs: 2, md: 4 } }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={`feature-${index}`}>
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
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        bgcolor: 'rgba(0, 255, 184, 0.1)',
                        color: '#00FFB8',
                        fontSize: '2.5rem',
                        mb: 3,
                        mx: 'auto',
                      }}
                    >
                      {feature.icon}
                    </Avatar>
                    <Typography
                      variant="h5"
                      sx={{
                        color: '#333333',
                        fontWeight: 600,
                        mb: 2,
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#666666',
                        lineHeight: 1.8,
                      }}
                    >
                      {feature.description}
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

export default PandaCharacter; 