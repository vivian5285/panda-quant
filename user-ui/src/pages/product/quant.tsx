import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Button, List, ListItem, ListItemIcon, Chip, Divider } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import SecurityIcon from '@mui/icons-material/Security';
import PsychologyIcon from '@mui/icons-material/Psychology';
import { Timeline as TimelineIcon } from '@mui/icons-material';
import SpeedIcon from '@mui/icons-material/Speed';
import { GradientTitle } from '@/components/common/GradientTitle';
import PandaCard from '@/components/common/PandaCard';

const QuantPage: React.FC = () => {
  const features = [
    {
      title: '智能策略',
      description: '基于人工智能的交易策略，自动适应市场变化',
      icon: <PsychologyIcon sx={{ fontSize: 40, color: '#00FFB8' }} />,
    },
    {
      title: '回测系统',
      description: '强大的回测系统，验证策略的有效性',
      icon: <AutoGraphIcon sx={{ fontSize: 40, color: '#00FFB8' }} />,
    },
    {
      title: '风险控制',
      description: '多重风险控制机制，保障资金安全',
      icon: <SecurityIcon sx={{ fontSize: 40, color: '#00FFB8' }} />,
    },
    {
      title: '实时监控',
      description: '24/7实时监控系统，确保交易安全',
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: '#00FFB8' }} />,
    },
    {
      title: '数据分析',
      description: '深度市场数据分析，发现交易机会',
      icon: <TimelineIcon sx={{ fontSize: 40, color: '#00FFB8' }} />,
    },
    {
      title: '高速执行',
      description: '毫秒级交易执行，把握市场机会',
      icon: <SpeedIcon sx={{ fontSize: 40, color: '#00FFB8' }} />,
    },
  ];

  const strategies = [
    {
      name: '趋势跟踪',
      description: '基于技术指标的 trend following 策略，适合趋势明显的市场。',
      performance: '+15.2%',
      risk: '中等',
      tags: ['趋势交易', '技术分析', 'ATR指标'],
    },
    {
      name: '均值回归',
      description: '利用价格偏离均值的特性进行交易，适合震荡市场。',
      performance: '+12.8%',
      risk: '低',
      tags: ['震荡交易', '统计套利', '布林带'],
    },
    {
      name: '套利策略',
      description: '利用市场价差进行套利交易，风险较低，收益稳定。',
      performance: '+8.5%',
      risk: '低',
      tags: ['套利交易', '价差交易', '低风险'],
    },
    {
      name: '网格交易',
      description: '在价格区间内设置网格，利用价格波动获取收益。',
      performance: '+10.3%',
      risk: '低',
      tags: ['网格交易', '区间交易', '自动化'],
    },
    {
      name: '动量策略',
      description: '捕捉市场动量，跟随强势趋势获取收益。',
      performance: '+18.6%',
      risk: '高',
      tags: ['动量交易', '趋势跟踪', 'RSI指标'],
    },
    {
      name: '对冲策略',
      description: '通过多空对冲降低风险，获取稳定收益。',
      performance: '+9.2%',
      risk: '低',
      tags: ['对冲交易', '风险对冲', '稳定收益'],
    },
  ];

  const dailyStrategies = [
    {
      date: '2024-03-20',
      name: '超级趋势策略',
      market: 'BTC/USDT',
      signal: '买入',
      confidence: '高',
      description: '基于ATR指标的超级趋势策略发出买入信号，当前市场趋势明显。',
    },
    {
      date: '2024-03-20',
      name: '网格交易策略',
      market: 'ETH/USDT',
      signal: '持有',
      confidence: '中',
      description: '网格交易策略在预设区间内运行良好，建议继续持有。',
    },
    {
      date: '2024-03-20',
      name: '动量策略',
      market: 'SOL/USDT',
      signal: '卖出',
      confidence: '高',
      description: '动量指标显示超买，建议获利了结。',
    },
  ];

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <GradientTitle variant="h2" align="center" sx={{ mb: 6 }}>
          量化交易
        </GradientTitle>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <PandaCard>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {feature.icon}
                    </ListItemIcon>
                    <Typography variant="h5" component="h3">
                      {feature.title}
                    </Typography>
                  </Box>
                  <Typography color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </PandaCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default QuantPage; 