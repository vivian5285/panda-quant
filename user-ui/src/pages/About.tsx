import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, useTheme, alpha } from '@mui/material';
import { GradientTitle } from '@/components/common/GradientTitle';
import PandaCard from '@/components/common/PandaCard';
import { motion } from 'framer-motion';
import GlobalBackground from '@/components/common/GlobalBackground';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/home/Footer';

const AboutPage: React.FC = () => {
  const theme = useTheme();
  
  const features = [
    {
      title: 'AI量化交易',
      description: '利用人工智能和机器学习技术，分析市场数据，预测价格走势，实现自动化交易。',
      icon: '🤖',
      color: '#00FFB8',
    },
    {
      title: '多策略组合',
      description: '结合趋势跟踪、网格交易、动量突破等多种策略，适应不同市场环境。',
      icon: '📊',
      color: '#00B8FF',
    },
    {
      title: '风险控制',
      description: '多层次风险控制体系，包括止损、仓位管理、波动率控制等，保障资金安全。',
      icon: '🛡️',
      color: '#FFB800',
    },
  ];

  const strategies = [
    {
      title: '超级趋势策略',
      description: '基于ATR指标的动态趋势跟踪策略，自动适应市场波动，月化收益50%-300%。',
      icon: '📈',
      color: '#00FFB8',
    },
    {
      title: '网格交易策略',
      description: '在价格区间内设置网格，利用价格波动获取收益，月化收益50%-300%。',
      icon: '📊',
      color: '#00B8FF',
    },
    {
      title: '动量突破策略',
      description: '捕捉价格突破关键位后的动量行情，适合趋势启动阶段，月化收益50%-300%。',
      icon: '🚀',
      color: '#FFB800',
    },
    {
      title: '套利策略',
      description: '利用不同交易所之间的价差进行套利交易，月化收益50%-300%。',
      icon: '💱',
      color: '#FF00B8',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <Box sx={{ 
      py: 8,
      background: 'linear-gradient(135deg, rgba(0, 255, 184, 0.05) 0%, rgba(0, 255, 184, 0.02) 100%)',
      minHeight: '100vh',
    }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <GradientTitle 
            title="关于我们"
            variant="h2" 
            align="center" 
            sx={{ 
              mb: 6,
              fontSize: { xs: '2rem', md: '3rem' },
              fontWeight: 700,
            }}
          >
            关于我们
          </GradientTitle>
          <Typography 
            variant="subtitle1" 
            align="center" 
            sx={{ 
              mb: 8,
              color: 'text.secondary',
              maxWidth: '800px',
              mx: 'auto',
            }}
          >
            专业的量化交易平台，为投资者提供智能、高效、安全的交易解决方案
          </Typography>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div variants={itemVariants}>
                  <PandaCard>
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mb: 3,
                        gap: 2,
                      }}>
                        <Box sx={{
                          width: 60,
                          height: 60,
                          borderRadius: '50%',
                          bgcolor: alpha(feature.color, 0.1),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '2rem',
                        }}>
                          {feature.icon}
                        </Box>
                        <Typography 
                          variant="h5" 
                          component="h3"
                          sx={{
                            fontWeight: 600,
                            background: `linear-gradient(45deg, ${feature.color}, ${alpha(feature.color, 0.8)})`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }}
                        >
                          {feature.title}
                        </Typography>
                      </Box>
                      <Typography 
                        color="text.secondary"
                        sx={{ 
                          lineHeight: 1.8,
                          fontSize: '1rem',
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </PandaCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Box sx={{ 
            mb: 8, 
            textAlign: 'center',
            mt: 12,
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -20,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '60px',
              height: '4px',
              background: 'linear-gradient(90deg, #00FFB8, #00B8FF)',
              borderRadius: '2px',
            }
          }}>
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontWeight: 700,
                mb: 3,
                background: 'linear-gradient(45deg, #00FFB8, #00B8FF)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                position: 'relative',
                display: 'inline-block',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -10,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '40px',
                  height: '2px',
                  background: 'linear-gradient(90deg, #00FFB8, #00B8FF)',
                  borderRadius: '1px',
                }
              }}
            >
              我们的策略
            </Typography>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: 'text.secondary',
                fontSize: { xs: '1rem', md: '1.1rem' },
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.8,
                opacity: 0.8,
              }}
            >
              多样化的交易策略，满足不同投资需求
            </Typography>
          </Box>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={4} sx={{ mb: 8 }}>
            {strategies.map((strategy, index) => (
              <Grid item xs={12} md={6} key={index}>
                <motion.div variants={itemVariants}>
                  <PandaCard>
                    <Card sx={{ 
                      height: '100%',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: `0 8px 24px rgba(0, 0, 0, 0.2)`,
                      },
                    }}>
                      <CardContent sx={{ p: 4 }}>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          mb: 3,
                          gap: 2,
                        }}>
                          <Box sx={{
                            width: 50,
                            height: 50,
                            borderRadius: '50%',
                            bgcolor: alpha(strategy.color, 0.1),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.5rem',
                          }}>
                            {strategy.icon}
                          </Box>
                          <Typography 
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              background: `linear-gradient(45deg, ${strategy.color}, ${alpha(strategy.color, 0.8)})`,
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                            }}
                          >
                            {strategy.title}
                          </Typography>
                        </Box>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            lineHeight: 1.8,
                            fontSize: '0.95rem',
                          }}
                        >
                          {strategy.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </PandaCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <PandaCard>
            <Box sx={{ p: 4 }}>
              <Typography 
                variant="h5" 
                gutterBottom
                sx={{
                  fontWeight: 600,
                  mb: 3,
                  background: 'linear-gradient(45deg, #00FFB8, #00B8FF)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                安全与保障
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary" 
                paragraph
                sx={{ mb: 4 }}
              >
                我们高度重视用户资产安全，采用多重安全措施保障您的资金安全：
              </Typography>
              <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 3, bgcolor: alpha('#00FFB8', 0.05), borderRadius: 2 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                      资金安全
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        • 平台采用多重签名技术，确保资金安全
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • 所有交易记录上链，保证透明可追溯
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 3, bgcolor: alpha('#00B8FF', 0.05), borderRadius: 2 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                      API安全
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        • 仅使用只读和交易权限，不涉及提现权限
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • 采用IP白名单和API密钥加密存储
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 3, bgcolor: alpha('#FFB800', 0.05), borderRadius: 2 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                      系统安全
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        • 24/7实时监控系统，及时发现异常
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • 定期安全审计和漏洞修复
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </PandaCard>
        </motion.div>
      </Container>
    </Box>
  );
};

export default AboutPage; 