import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Button, Avatar, Chip } from '@mui/material';
import GlobalBackground from '@/components/common/GlobalBackground';
import { GradientTitle } from '@/components/common/GradientTitle';
import PandaCard from '@/components/common/PandaCard';

const CommunityPage: React.FC = () => {
  const communitySections = [
    {
      title: '策略讨论',
      description: '分享交易策略，交流交易心得',
      icon: '📊',
      members: '2.5k+',
      posts: '1.2k+'
    },
    {
      title: '市场分析',
      description: '分析市场趋势，分享交易机会',
      icon: '📈',
      members: '3.1k+',
      posts: '1.8k+'
    },
    {
      title: '新手入门',
      description: '新手交流，快速成长',
      icon: '🎓',
      members: '5.2k+',
      posts: '3.4k+'
    },
    {
      title: '技术交流',
      description: '讨论技术指标，优化交易系统',
      icon: '💻',
      members: '1.8k+',
      posts: '900+'
    }
  ];

  const recentPosts = [
    {
      title: '超级趋势策略实战分享',
      author: 'CryptoWhale',
      date: '2024-03-20',
      likes: 128,
      comments: 45,
      category: '策略讨论'
    },
    {
      title: '比特币突破关键阻力位分析',
      author: 'TradingNinja',
      date: '2024-03-19',
      likes: 95,
      comments: 32,
      category: '市场分析'
    },
    {
      title: '新手如何选择交易策略？',
      author: 'BlockchainSage',
      date: '2024-03-18',
      likes: 76,
      comments: 28,
      category: '新手入门'
    },
    {
      title: 'RSI指标优化方案',
      author: 'DeFiMaster',
      date: '2024-03-17',
      likes: 64,
      comments: 21,
      category: '技术交流'
    }
  ];

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <GlobalBackground />
      
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <GradientTitle
          title="社区"
          subtitle="交流与分享"
          sx={{ mb: 6 }}
        />

        <Grid container spacing={4} sx={{ mb: 8 }}>
          {communitySections.map((section, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <PandaCard>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" sx={{ mb: 2 }}>
                      {section.icon}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      {section.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {section.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        {section.members} 成员
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {section.posts} 帖子
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </PandaCard>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h5" sx={{ mb: 4 }}>
          最新帖子
        </Typography>
        
        <Grid container spacing={4}>
          {recentPosts.map((post, index) => (
            <Grid item xs={12} key={index}>
              <PandaCard>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {post.title}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Avatar sx={{ width: 24, height: 24 }} />
                          <Typography variant="body2" color="text.secondary">
                            {post.author}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {post.date}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        label={post.category}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(0, 255, 184, 0.1)',
                          color: '#00FFB8',
                        }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        {post.likes} 点赞
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {post.comments} 评论
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </PandaCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default CommunityPage; 