import React, { useState } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Button, Chip, Tabs, Tab } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import SecurityIcon from '@mui/icons-material/Security';
import { GradientTitle } from '@/components/common/GradientTitle';
import PandaCard from '@/components/common/PandaCard';

const StrategiesPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const strategies = [
    {
      name: '超级趋势策略',
      description: '基于ATR指标的动态趋势跟踪策略，自动适应市场波动。',
      performance: '月化收益50%-300%',
      risk: '中等',
      category: '趋势跟踪',
      tags: ['ATR', '趋势跟踪', '动态止损'],
      supportedPlatforms: ['币安', 'OKX', 'Gate', 'Bitget', 'MT4'],
    },
    {
      name: '网格交易策略',
      description: '在价格区间内设置网格，利用价格波动获取收益。',
      performance: '月化收益50%-300%',
      risk: '低',
      category: '区间交易',
      tags: ['网格', '区间交易', '低风险'],
      supportedPlatforms: ['币安', 'OKX', 'Gate', 'Bitget', 'MT4'],
    },
    {
      name: '动量突破策略',
      description: '捕捉价格突破关键位后的动量行情，适合趋势启动阶段。',
      performance: '月化收益50%-300%',
      risk: '中等',
      category: '突破交易',
      tags: ['动量', '突破', '趋势启动'],
      supportedPlatforms: ['币安', 'OKX', 'Gate', 'Bitget', 'MT4'],
    },
    {
      name: '套利策略',
      description: '利用不同交易所之间的价差进行套利交易。',
      performance: '月化收益50%-300%',
      risk: '低',
      category: '套利',
      tags: ['套利', '低风险', '稳定收益'],
      supportedPlatforms: ['币安', 'OKX', 'Gate', 'Bitget'],
    },
  ];

  const platforms = [
    {
      name: '加密货币交易所',
      description: '支持币安、OKX、Gate、Bitget等主流交易所',
      features: ['现货交易', '合约交易', 'API接入', '实时监控'],
      icon: '🪙',
    },
    {
      name: 'MT4交易平台',
      description: '支持伦敦金、外汇等传统金融产品交易',
      features: ['黄金交易', '外汇交易', 'API接入', '实时监控'],
      icon: '📊',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <GradientTitle>
          量化策略
        </GradientTitle>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
          智能交易策略，让您的投资更高效
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          sx={{
            '& .MuiTab-root': {
              color: 'text.secondary',
              '&.Mui-selected': {
                color: '#00FFB8',
              },
            },
            '& .MuiTabs-indicator': {
              bgcolor: '#00FFB8',
            },
          }}
        >
          <Tab label="全部策略" />
          <Tab label="趋势跟踪" />
          <Tab label="区间交易" />
          <Tab label="套利策略" />
        </Tabs>
      </Box>
      
      <Grid container spacing={4}>
        {strategies.map((strategy, index) => (
          <Grid item xs={12} md={6} key={index}>
            <PandaCard>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6">
                      {strategy.name}
                    </Typography>
                    <Chip
                      label={strategy.category}
                      size="small"
                      sx={{
                        bgcolor: 'rgba(0, 255, 184, 0.1)',
                        color: '#00FFB8',
                      }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {strategy.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    {strategy.tags.map((tag, tagIndex) => (
                      <Chip
                        key={tagIndex}
                        label={tag}
                        size="small"
                        variant="outlined"
                        sx={{
                          borderColor: 'rgba(0, 255, 184, 0.5)',
                          color: 'text.secondary',
                        }}
                      />
                    ))}
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      支持平台：
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {strategy.supportedPlatforms.map((platform, platformIndex) => (
                        <Chip
                          key={platformIndex}
                          label={platform}
                          size="small"
                          sx={{
                            bgcolor: 'rgba(0, 255, 184, 0.05)',
                            color: 'text.secondary',
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2">
                        月化收益：{strategy.performance}
                      </Typography>
                      <Typography variant="body2">
                        风险等级：{strategy.risk}
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        bgcolor: '#00FFB8',
                        color: 'white',
                        '&:hover': {
                          bgcolor: '#00E6A5',
                        },
                      }}
                    >
                      查看详情
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </PandaCard>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 8, mb: 6, textAlign: 'center' }}>
        <GradientTitle>
          支持交易平台
        </GradientTitle>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
          支持主流加密货币交易所和MT4平台
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {platforms.map((platform, index) => (
          <Grid item xs={12} md={6} key={index}>
            <PandaCard>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4" sx={{ mr: 2 }}>
                      {platform.icon}
                    </Typography>
                    <Typography variant="h6">
                      {platform.name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {platform.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {platform.features.map((feature, featureIndex) => (
                      <Chip
                        key={featureIndex}
                        label={feature}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(0, 255, 184, 0.05)',
                          color: 'text.secondary',
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </PandaCard>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default StrategiesPage; 