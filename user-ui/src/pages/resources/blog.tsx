import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, CardMedia, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { GradientTitle } from '@/components/common/GradientTitle';
import PandaCard from '@/components/common/PandaCard';

const BlogPage: React.FC = () => {
  const navigate = useNavigate();

  const blogPosts = [
    {
      id: 1,
      title: '量化交易入门指南',
      date: '2024-03-20',
      author: 'CryptoWhale',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop',
      summary: '本文详细介绍量化交易的基本概念、常用策略和风险管理方法，帮助新手快速入门。',
      category: '入门教程',
      readTime: '10分钟',
      slug: 'quant-trading-guide'
    },
    {
      id: 2,
      title: '超级趋势策略深度解析',
      date: '2024-03-18',
      author: 'TradingNinja',
      image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&h=400&fit=crop',
      summary: '深入分析超级趋势策略的原理、参数设置和实战应用，帮助投资者更好地使用该策略。',
      category: '策略分析',
      readTime: '15分钟',
      slug: 'super-trend-strategy'
    },
    {
      id: 3,
      title: '加密货币市场趋势分析',
      date: '2024-03-15',
      author: 'BlockchainSage',
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop',
      summary: '基于大数据分析，解读当前加密货币市场的主要趋势和投资机会。',
      category: '市场分析',
      readTime: '12分钟',
      slug: 'crypto-market-analysis'
    },
    {
      id: 4,
      title: '量化交易风险管理',
      date: '2024-03-12',
      author: 'DeFiMaster',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
      summary: '详细介绍量化交易中的风险管理方法，帮助投资者控制风险，提高收益。',
      category: '风险管理',
      readTime: '8分钟',
      slug: 'risk-management'
    },
  ];

  const handleBlogClick = (slug: string) => {
    navigate(`/resources/blog/${slug}`);
  };

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ mb: 6 }}>
          <GradientTitle variant="h4" sx={{ mb: 2 }}>
            博客
          </GradientTitle>
          <Typography variant="subtitle1" color="text.secondary">
            量化交易知识与见解
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          {blogPosts.map((post) => (
            <Grid item xs={12} md={6} key={post.id}>
              <PandaCard>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                    },
                  }}
                  onClick={() => handleBlogClick(post.slug)}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={post.image}
                    alt={post.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        {post.date}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {post.readTime}
                      </Typography>
                    </Box>
                    <Typography variant="h6" gutterBottom>
                      {post.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {post.summary}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        作者：{post.author}
                      </Typography>
                      <Chip
                        label={post.category}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(0, 255, 184, 0.1)',
                          color: '#00FFB8',
                        }}
                      />
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

export default BlogPage; 