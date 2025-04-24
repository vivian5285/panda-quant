import React from 'react';
import { Box, Container, Typography, Grid, Paper, Chip } from '@mui/material';
import { GlobalBackground } from '@/components/common/GlobalBackground';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { GradientTitle } from '@/components/common/GradientTitle';
import { PandaCard } from '@/components/common/PandaCard';

const ChangelogPage: React.FC = () => {
  const updates = [
    {
      version: '1.2.0',
      date: '2024-04-24',
      type: 'feature',
      changes: [
        '新增超级趋势策略',
        '优化网格交易策略参数',
        '添加实时收益监控功能',
        '改进用户界面交互体验'
      ]
    },
    {
      version: '1.1.0',
      date: '2024-04-15',
      type: 'improvement',
      changes: [
        '优化API接口响应速度',
        '改进风险控制系统',
        '添加更多交易对支持',
        '优化移动端显示效果'
      ]
    },
    {
      version: '1.0.0',
      date: '2024-04-01',
      type: 'release',
      changes: [
        '平台正式上线',
        '支持基础交易策略',
        '实现用户认证系统',
        '完成基础功能开发'
      ]
    }
  ];

  const getChipColor = (type: string) => {
    switch (type) {
      case 'feature':
        return '#00FFB8';
      case 'improvement':
        return '#4CAF50';
      case 'release':
        return '#2196F3';
      default:
        return '#666666';
    }
  };

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <GlobalBackground />
      <Navbar />
      
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <GradientTitle
          title="更新日志"
          subtitle="了解平台最新动态"
          sx={{ mb: 6 }}
        />

        <Grid container spacing={4}>
          {updates.map((update, index) => (
            <Grid item xs={12} key={index}>
              <PandaCard>
                <Box sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5" sx={{ mr: 2 }}>
                      v{update.version}
                    </Typography>
                    <Chip
                      label={update.type === 'feature' ? '新功能' : update.type === 'improvement' ? '优化' : '发布'}
                      sx={{
                        bgcolor: getChipColor(update.type),
                        color: 'white',
                        fontWeight: 500,
                      }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
                      {update.date}
                    </Typography>
                  </Box>
                  <Box sx={{ pl: 2 }}>
                    {update.changes.map((change, idx) => (
                      <Typography key={idx} variant="body1" sx={{ mb: 1 }}>
                        • {change}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              </PandaCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Footer />
    </Box>
  );
};

export default ChangelogPage; 