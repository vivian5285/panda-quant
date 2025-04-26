import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, Divider, Chip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GlobalBackground from '@/components/common/GlobalBackground';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import PandaCard from '@/components/common/PandaCard';

const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // 模拟博客数据
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
      slug: 'quant-trading-guide',
      content: `
        <h2>什么是量化交易？</h2>
        <p>量化交易是一种利用数学模型和计算机程序进行交易决策的方法。它通过分析历史数据、市场趋势和统计模式来制定交易策略。</p>
        
        <h2>量化交易的优势</h2>
        <ul>
          <li>消除情绪影响</li>
          <li>提高交易效率</li>
          <li>实现风险控制</li>
          <li>可以进行回测验证</li>
        </ul>
        
        <h2>入门步骤</h2>
        <ol>
          <li>学习基础知识</li>
          <li>选择交易平台</li>
          <li>开发交易策略</li>
          <li>进行回测</li>
          <li>实盘交易</li>
        </ol>
      `
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
      slug: 'super-trend-strategy',
      content: `
        <h2>超级趋势策略概述</h2>
        <p>超级趋势策略是一种基于趋势跟踪的交易策略，通过计算平均真实范围（ATR）来确定市场趋势。</p>
        
        <h2>策略原理</h2>
        <p>超级趋势指标通过计算ATR和价格移动平均线来确定市场趋势。当价格突破上轨时产生买入信号，突破下轨时产生卖出信号。</p>
        
        <h2>参数设置</h2>
        <ul>
          <li>ATR周期：通常设置为10-14</li>
          <li>ATR乘数：通常设置为2-3</li>
          <li>移动平均线周期：通常设置为20</li>
        </ul>
      `
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
      slug: 'crypto-market-analysis',
      content: `
        <h2>当前市场概况</h2>
        <p>加密货币市场在2024年第一季度表现出强劲的增长势头，比特币和以太坊等主流币种引领市场上涨。</p>
        
        <h2>主要趋势</h2>
        <ul>
          <li>机构投资者持续入场</li>
          <li>DeFi生态持续扩张</li>
          <li>NFT市场回暖</li>
          <li>Layer2解决方案普及</li>
        </ul>
        
        <h2>投资建议</h2>
        <p>建议投资者关注基本面良好的项目，同时注意控制风险，合理配置资产。</p>
      `
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
      slug: 'risk-management',
      content: `
        <h2>风险管理的重要性</h2>
        <p>在量化交易中，风险管理是确保长期盈利的关键因素。良好的风险管理可以保护资金，提高策略的稳定性。</p>
        
        <h2>主要风险类型</h2>
        <ul>
          <li>市场风险</li>
          <li>流动性风险</li>
          <li>操作风险</li>
          <li>模型风险</li>
        </ul>
        
        <h2>风险管理策略</h2>
        <p>建议采用分散投资、设置止损、控制仓位等方法进行风险管理。</p>
      `
    },
  ];

  const blogPost = blogPosts.find(post => post.slug === slug);

  if (!blogPost) {
    return (
      <Box sx={{ position: 'relative', minHeight: '100vh' }}>
        <GlobalBackground />
        <Navbar />
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography variant="h4" gutterBottom>
            文章未找到
          </Typography>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/resources/blog')}
            sx={{ mt: 2 }}
          >
            返回博客列表
          </Button>
        </Container>
        <Footer />
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <GlobalBackground />
      <Navbar />
      
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/resources/blog')}
          sx={{ mb: 4 }}
        >
          返回博客列表
        </Button>

        <PandaCard>
          <Box sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>
              {blogPost.title}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                作者：{blogPost.author}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                {blogPost.date}
              </Typography>
              <Chip
                label={blogPost.category}
                size="small"
                sx={{
                  bgcolor: 'rgba(0, 255, 184, 0.1)',
                  color: '#00FFB8',
                }}
              />
            </Box>

            <Box
              component="img"
              src={blogPost.image}
              alt={blogPost.title}
              sx={{
                width: '100%',
                height: '400px',
                objectFit: 'cover',
                borderRadius: 2,
                mb: 4,
              }}
            />

            <Typography variant="body1" paragraph>
              {blogPost.summary}
            </Typography>

            <Divider sx={{ my: 4 }} />

            <Box
              dangerouslySetInnerHTML={{ __html: blogPost.content }}
              sx={{
                '& h2': {
                  mt: 4,
                  mb: 2,
                  color: '#00FFB8',
                },
                '& p': {
                  mb: 2,
                },
                '& ul, & ol': {
                  pl: 4,
                  mb: 2,
                },
                '& li': {
                  mb: 1,
                },
              }}
            />
          </Box>
        </PandaCard>
      </Container>

      <Footer />
    </Box>
  );
};

export default BlogDetailPage; 