import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  TextField, 
  InputAdornment,
  Card,
  CardContent,
  CardActionArea,
  IconButton,
  useTheme
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import HelpIcon from '@mui/icons-material/Help';
import SchoolIcon from '@mui/icons-material/School';
import DescriptionIcon from '@mui/icons-material/Description';
import BusinessIcon from '@mui/icons-material/Business';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import { GradientTitle } from '@/components/common/GradientTitle';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HelpCenterPage: React.FC = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const helpCategories = [
    {
      title: '常见问题',
      description: '查找常见问题的解答',
      icon: <HelpIcon sx={{ fontSize: 40 }} />,
      link: '/resources/faq',
      color: '#00FFB8'
    },
    {
      title: '使用教程',
      description: '学习如何使用平台功能',
      icon: <SchoolIcon sx={{ fontSize: 40 }} />,
      link: '/resources/tutorials',
      color: '#00B8FF'
    },
    {
      title: '技术文档',
      description: '查看详细的技术文档',
      icon: <DescriptionIcon sx={{ fontSize: 40 }} />,
      link: '/resources/documentation',
      color: '#FFB800'
    },
    {
      title: '案例研究',
      description: '了解成功案例和经验',
      icon: <BusinessIcon sx={{ fontSize: 40 }} />,
      link: '/resources/case-studies',
      color: '#FF00B8'
    },
    {
      title: '联系我们',
      description: '获取技术支持',
      icon: <ContactSupportIcon sx={{ fontSize: 40 }} />,
      link: '/resources/contact',
      color: '#B800FF'
    }
  ];

  const popularArticles = [
    {
      title: '如何开始量化交易',
      category: '教程',
      link: '/resources/tutorials/getting-started'
    },
    {
      title: 'API接入指南',
      category: '文档',
      link: '/resources/documentation/api-guide'
    },
    {
      title: '策略优化技巧',
      category: '案例',
      link: '/resources/case-studies/strategy-optimization'
    }
  ];

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <GradientTitle
          title="帮助中心"
          subtitle="查找您需要的帮助信息"
          sx={{ mb: 6 }}
        />

        {/* 搜索框 */}
        <Box sx={{ mb: 6 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="搜索帮助内容..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 2,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                },
              },
            }}
          />
        </Box>

        {/* 分类导航 */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {helpCategories.map((category, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  sx={{ 
                    height: '100%',
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: `0 8px 24px rgba(0, 0, 0, 0.2)`,
                    },
                  }}
                >
                  <CardActionArea 
                    component={Link}
                    to={category.link}
                    sx={{ height: '100%', p: 3 }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      textAlign: 'center',
                      gap: 2
                    }}>
                      <Box sx={{ 
                        color: category.color,
                        mb: 2
                      }}>
                        {category.icon}
                      </Box>
                      <Typography variant="h6" component="h2">
                        {category.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {category.description}
                      </Typography>
                    </Box>
                  </CardActionArea>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* 热门文章 */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            热门文章
          </Typography>
          <Grid container spacing={3}>
            {popularArticles.map((article, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    sx={{ 
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: `0 8px 24px rgba(0, 0, 0, 0.2)`,
                      },
                    }}
                  >
                    <CardActionArea component={Link} to={article.link}>
                      <CardContent>
                        <Typography variant="subtitle2" color="primary" gutterBottom>
                          {article.category}
                        </Typography>
                        <Typography variant="h6" component="h3">
                          {article.title}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default HelpCenterPage; 