import React from 'react';
import { Box, Container, Typography, Grid, Button, Paper, Stepper, Step, StepLabel } from '@mui/material';
import { GlobalBackground } from '@/components/common/GlobalBackground';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { GradientTitle } from '@/components/common/GradientTitle';
import { PandaCard } from '@/components/common/PandaCard';

const ProductPage: React.FC = () => {
  const strategies = [
    {
      name: '超级趋势策略',
      description: '基于ATR指标的动态趋势跟踪策略，自动适应市场波动。',
      performance: '月化收益50%-300%',
      risk: '中等',
      category: '趋势跟踪',
      features: ['自动趋势识别', '动态止损', '多时间框架分析']
    },
    {
      name: '网格交易策略',
      description: '在价格区间内设置网格，利用价格波动获取收益。',
      performance: '月化收益50%-300%',
      risk: '低',
      category: '区间交易',
      features: ['自动网格布局', '智能加仓', '风险分散']
    },
    {
      name: '动量突破策略',
      description: '捕捉价格突破关键位后的动量行情，适合趋势启动阶段。',
      performance: '月化收益50%-300%',
      risk: '中等',
      category: '突破交易',
      features: ['突破点识别', '动量追踪', '快速响应']
    },
  ];

  const productFeatures = [
    {
      title: '策略特点',
      items: ['自动交易', '风险控制', '收益分析', '实时监控', '参数优化']
    },
    {
      title: '使用流程',
      items: ['选择策略', '设置参数', '开始交易', '监控收益', '优化调整']
    }
  ];

  const usageSteps = [
    {
      title: '注册账户',
      description: '完成邮箱验证和身份认证'
    },
    {
      title: '选择策略',
      description: '根据风险偏好选择适合的策略'
    },
    {
      title: '设置参数',
      description: '自定义交易参数和风险控制'
    },
    {
      title: '开始交易',
      description: '启动自动交易系统'
    }
  ];

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <GlobalBackground />
      <Navbar />
      
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <GradientTitle>
            高收益交易策略
          </GradientTitle>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
            月化收益50%-300%，我们只收取收益的10%
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ mb: 6 }}>
          {strategies.map((strategy, index) => (
            <Grid item xs={12} md={4} key={index}>
              <PandaCard>
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    {strategy.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {strategy.description}
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    {strategy.features.map((feature, idx) => (
                      <Typography key={idx} variant="body2" sx={{ mb: 1 }}>
                        ✓ {feature}
                      </Typography>
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="body2">
                      月化收益：{strategy.performance}
                    </Typography>
                    <Typography variant="body2">
                      风险等级：{strategy.risk}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      bgcolor: '#00FFB8',
                      color: 'white',
                      '&:hover': {
                        bgcolor: '#00E6A5',
                      },
                    }}
                  >
                    了解更多
                  </Button>
                </Box>
              </PandaCard>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={4} sx={{ mb: 6 }}>
          {productFeatures.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <PandaCard>
                <Typography variant="h5" gutterBottom>
                  {feature.title}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {feature.items.map((item, idx) => (
                    <Typography key={idx} variant="body1" sx={{ mb: 1 }}>
                      ✓ {item}
                    </Typography>
                  ))}
                </Box>
              </PandaCard>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" gutterBottom align="center">
            使用流程
          </Typography>
          <Stepper orientation="vertical" sx={{ mt: 4 }}>
            {usageSteps.map((step, index) => (
              <Step key={index} active={true}>
                <StepLabel>
                  <Typography variant="h6">{step.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {step.description}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <PandaCard>
              <Typography variant="h5" gutterBottom>
                策略定制服务
              </Typography>
              <Typography variant="body1" color="text.secondary">
                根据您的投资目标和风险偏好，为您定制专属的交易策略，月化收益可达50%-300%。
              </Typography>
            </PandaCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <PandaCard>
              <Typography variant="h5" gutterBottom>
                实时监控系统
              </Typography>
              <Typography variant="body1" color="text.secondary">
                24/7实时监控系统，确保您的交易安全，及时响应市场变化，最大化您的收益。
              </Typography>
            </PandaCard>
          </Grid>
        </Grid>
      </Container>

      <Footer />
    </Box>
  );
};

export default ProductPage; 