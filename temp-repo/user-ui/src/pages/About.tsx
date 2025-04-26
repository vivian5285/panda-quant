import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import GlobalBackground from '@/components/common/GlobalBackground';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import GradientTitle from '@/components/common/GradientTitle';
import PandaCard from '@/components/common/PandaCard';

const AboutPage: React.FC = () => {
  const features = [
    {
      title: 'AI量化交易',
      description: '利用人工智能和机器学习技术，分析市场数据，预测价格走势，实现自动化交易。',
      icon: '🤖',
    },
    {
      title: '多策略组合',
      description: '结合趋势跟踪、网格交易、动量突破等多种策略，适应不同市场环境。',
      icon: '📊',
    },
    {
      title: '风险控制',
      description: '严格的风险管理体系，包括止损、仓位管理、资金管理等，确保交易安全。',
      icon: '🛡️',
    },
    {
      title: '实时监控',
      description: '24/7实时监控系统，及时发现并处理异常情况，确保交易稳定运行。',
      icon: '👀',
    },
  ];

  const strategies = [
    {
      title: '超级趋势策略',
      description: '基于ATR指标的动态趋势跟踪策略，自动适应市场波动，月化收益50%-300%。',
      icon: '📈',
    },
    {
      title: '网格交易策略',
      description: '在价格区间内设置网格，利用价格波动获取收益，月化收益50%-300%。',
      icon: '📊',
    },
    {
      title: '动量突破策略',
      description: '捕捉价格突破关键位后的动量行情，适合趋势启动阶段，月化收益50%-300%。',
      icon: '🚀',
    },
    {
      title: '套利策略',
      description: '利用不同交易所之间的价差进行套利交易，月化收益50%-300%。',
      icon: '💱',
    },
  ];

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <GlobalBackground />
      <Navbar />
      
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <GradientTitle>
            关于我们
          </GradientTitle>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
            专业的AI量化交易平台，月化收益50%-300%，我们只收取收益的10%
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ mb: 6 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <PandaCard>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h4" sx={{ mr: 2 }}>
                        {feature.icon}
                      </Typography>
                      <Typography variant="h6">
                        {feature.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </PandaCard>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <GradientTitle>
            我们的策略
          </GradientTitle>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
            多样化的交易策略，满足不同投资需求
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ mb: 6 }}>
          {strategies.map((strategy, index) => (
            <Grid item xs={12} md={6} key={index}>
              <PandaCard>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h4" sx={{ mr: 2 }}>
                        {strategy.icon}
                      </Typography>
                      <Typography variant="h6">
                        {strategy.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {strategy.description}
                    </Typography>
                  </CardContent>
                </Card>
              </PandaCard>
            </Grid>
          ))}
        </Grid>

        <PandaCard>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              安全与保障
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              我们高度重视用户资产安全：
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="subtitle1">
                  资金安全
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • 平台采用多重签名技术，确保资金安全
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • 所有交易记录上链，保证透明可追溯
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle1">
                  API安全
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • 仅使用只读和交易权限，不涉及提现权限
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • 采用IP白名单和API密钥加密存储
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle1">
                  系统安全
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • 24/7实时监控系统，及时发现异常
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • 定期安全审计和漏洞修复
                </Typography>
              </Box>
            </Box>
          </Box>
        </PandaCard>
      </Container>

      <Footer />
    </Box>
  );
};

export default AboutPage; 