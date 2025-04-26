import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Button, Stepper, Step, StepLabel, StepContent } from '@mui/material';
import GlobalBackground from '@/components/common/GlobalBackground';
import { GradientTitle } from '@/components/common/GradientTitle';
import PandaCard from '@/components/common/PandaCard';

const ProfitPage: React.FC = () => {
  const steps = [
    {
      label: '选择交易方式',
      description: '您可以选择以下两种方式开始交易：',
      options: [
        {
          title: '充值USDT到平台',
          description: '将USDT充值到平台账户，系统自动运行策略，无需手动操作。',
          icon: '💳',
        },
        {
          title: '连接交易所API',
          description: '提供币安、OKX、Gate、Bitget等交易所的API，我们通过API进行交易。',
          icon: '🔗',
        },
      ],
    },
    {
      label: '选择交易策略',
      description: '根据您的风险偏好选择适合的策略：',
      options: [
        {
          title: '超级趋势策略',
          description: '月化收益50%-300%，适合追求高收益的投资者。',
          icon: '📈',
        },
        {
          title: '网格交易策略',
          description: '月化收益50%-300%，适合追求稳定收益的投资者。',
          icon: '📊',
        },
      ],
    },
    {
      label: '开始交易',
      description: '系统自动执行交易策略，您只需等待收益：',
      options: [
        {
          title: '实时监控',
          description: '24/7实时监控系统，确保交易安全。',
          icon: '👀',
        },
        {
          title: '收益结算',
          description: '收益实时结算，我们只收取收益的10%。',
          icon: '💰',
        },
      ],
    },
  ];

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <GlobalBackground />
      
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <GradientTitle>
            收益榜
          </GradientTitle>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
            月化收益50%-300%，我们只收取收益的10%
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12}>
            <PandaCard>
              <Stepper orientation="vertical">
                {steps.map((step, index) => (
                  <Step key={index} active={true}>
                    <StepLabel>{step.label}</StepLabel>
                    <StepContent>
                      <Typography variant="body1" color="text.secondary" paragraph>
                        {step.description}
                      </Typography>
                      <Grid container spacing={2} sx={{ mt: 2 }}>
                        {step.options.map((option, optionIndex) => (
                          <Grid item xs={12} md={6} key={optionIndex}>
                            <Card sx={{ height: '100%' }}>
                              <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                  <Typography variant="h4" sx={{ mr: 2 }}>
                                    {option.icon}
                                  </Typography>
                                  <Typography variant="h6">
                                    {option.title}
                                  </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                  {option.description}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </PandaCard>
          </Grid>

          <Grid item xs={12}>
            <PandaCard>
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  收益分配说明
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  我们采用透明的收益分配机制：
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="subtitle1">
                      直接收益
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      您获得收益的90%，我们收取10%作为服务费。
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle1">
                      推荐收益
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      推荐新用户加入，您可以获得：
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ pl: 2 }}>
                      • 第一代用户收益的20%
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ pl: 2 }}>
                      • 第二代用户收益的10%
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle1">
                      结算方式
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      所有收益实时结算，无需等待。
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </PandaCard>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProfitPage; 