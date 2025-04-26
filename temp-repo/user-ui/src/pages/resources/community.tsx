import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Button, Avatar, Chip } from '@mui/material';
import GlobalBackground from '@/components/common/GlobalBackground';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import GradientTitle from '@/components/common/GradientTitle';
import PandaCard from '@/components/common/PandaCard';

const CommunityPage: React.FC = () => {
  const communitySections = [
    {
      id: 1,
      title: '策略讨论区',
      description: '分享交易策略、讨论市场趋势、交流投资经验',
      icon: '📈',
      memberCount: 1280,
      postCount: 3560,
    },
    {
      id: 2,
      title: '新手入门',
      description: '新手交流区，解答入门问题，分享学习心得',
      icon: '🎓',
      memberCount: 890,
      postCount: 1240,
    },
    {
      id: 3,
      title: '技术分析',
      description: '技术指标讨论、图表分析、交易信号分享',
      icon: '📊',
      memberCount: 1560,
      postCount: 2890,
    },
    {
      id: 4,
      title: '风险管理',
      description: '风险控制方法、资金管理策略、止损技巧',
      icon: '🛡️',
      memberCount: 1120,
      postCount: 1780,
    },
  ];

  const recentPosts = [
    {
      id: 1,
      title: '超级趋势策略实战分享',
      author: '张明',
      avatar: '/avatars/zhangming.jpg',
      date: '2024-03-20',
      category: '策略讨论',
      likes: 128,
      comments: 45,
    },
    {
      id: 2,
      title: '新手如何选择第一个策略',
      author: '李华',
      avatar: '/avatars/lihua.jpg',
      date: '2024-03-19',
      category: '新手入门',
      likes: 95,
      comments: 32,
    },
    {
      id: 3,
      title: 'MACD指标在加密货币中的应用',
      author: '王芳',
      avatar: '/avatars/wangfang.jpg',
      date: '2024-03-18',
      category: '技术分析',
      likes: 156,
      comments: 78,
    },
  ];

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <GlobalBackground />
      <Navbar />
      
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ mb: 6 }}>
          <GradientTitle>
            社区
          </GradientTitle>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
            交流分享，共同成长
          </Typography>
        </Box>
        
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {communitySections.map((section) => (
            <Grid item xs={12} md={6} key={section.id}>
              <PandaCard>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h4" sx={{ mr: 2 }}>
                        {section.icon}
                      </Typography>
                      <Typography variant="h6">
                        {section.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {section.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        {section.memberCount} 成员 · {section.postCount} 帖子
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{
                          color: '#00FFB8',
                          borderColor: '#00FFB8',
                          '&:hover': {
                            borderColor: '#00FFB8',
                            bgcolor: 'rgba(0, 255, 184, 0.1)',
                          },
                        }}
                      >
                        加入讨论
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </PandaCard>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mb: 4 }}>
          <GradientTitle>
            最新帖子
          </GradientTitle>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
            社区最新动态
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {recentPosts.map((post) => (
            <Grid item xs={12} key={post.id}>
              <PandaCard>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        src={post.avatar}
                        alt={post.author}
                        sx={{ width: 40, height: 40, mr: 2 }}
                      />
                      <Box>
                        <Typography variant="subtitle1">
                          {post.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {post.author} · {post.date}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip
                        label={post.category}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(0, 255, 184, 0.1)',
                          color: '#00FFB8',
                        }}
                      />
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          👍 {post.likes}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          💬 {post.comments}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </PandaCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Footer />
    </Box>
  );
};

export default CommunityPage; 