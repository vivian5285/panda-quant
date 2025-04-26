import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, CardMedia } from '@mui/material';
import GlobalBackground from '@/components/common/GlobalBackground';
import Navbar from '@/components/common/Navbar';
import { GradientTitle } from '@/components/common/GradientTitle';
import PandaCard from '@/components/common/PandaCard';
import { motion } from 'framer-motion';

const NewsPage: React.FC = () => {
  const newsItems = [
    {
      id: 1,
      title: '熊猫量化完成A轮融资',
      date: '2024-03-15',
      image: 'https://source.unsplash.com/800x400/?finance,investment',
      summary: '熊猫量化宣布完成A轮融资，由知名投资机构领投，将用于技术研发和市场拓展。',
      category: '公司动态',
    },
    {
      id: 2,
      title: '新策略上线：超级趋势2.0',
      date: '2024-03-10',
      image: 'https://source.unsplash.com/800x400/?trading,chart',
      summary: '我们发布了全新的超级趋势2.0策略，采用先进的机器学习算法，提供更精准的交易信号。',
      category: '产品更新',
    },
    {
      id: 3,
      title: '与Binance达成战略合作',
      date: '2024-03-05',
      image: 'https://source.unsplash.com/800x400/?cryptocurrency,blockchain',
      summary: '熊猫量化与Binance达成战略合作，为用户提供更优质的交易体验和更低的交易成本。',
      category: '合作动态',
    },
    {
      id: 4,
      title: '用户突破10万',
      date: '2024-02-28',
      image: 'https://source.unsplash.com/800x400/?growth,success',
      summary: '熊猫量化平台用户数突破10万，感谢所有用户的支持和信任。',
      category: '里程碑',
    },
  ];

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.src = 'https://via.placeholder.com/800x400?text=News+Image';
  };

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <GlobalBackground />
      <Navbar />
      
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <GradientTitle
            title="新闻动态"
            subtitle="了解熊猫量化的最新动态"
            sx={{ mb: 6 }}
          />
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={4}>
            {newsItems.map((news) => (
              <Grid item xs={12} md={6} key={news.id}>
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.5,
                      },
                    },
                  }}
                >
                  <PandaCard>
                    <Card sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                      },
                    }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={news.image}
                        alt={news.title}
                        onError={handleImageError}
                        sx={{ 
                          objectFit: 'cover',
                          borderTopLeftRadius: 8,
                          borderTopRightRadius: 8,
                          backgroundColor: 'rgba(0, 0, 0, 0.05)',
                          minHeight: '200px',
                        }}
                      />
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                          <Typography variant="caption" color="text.secondary">
                            {news.date}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              bgcolor: 'rgba(0, 255, 184, 0.1)',
                              color: '#00FFB8',
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                            }}
                          >
                            {news.category}
                          </Typography>
                        </Box>
                        <Typography 
                          variant="h6" 
                          gutterBottom
                          sx={{
                            fontWeight: 600,
                            mb: 2,
                            background: 'linear-gradient(45deg, #00FFB8, #00B8FF)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }}
                        >
                          {news.title}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ lineHeight: 1.8 }}
                        >
                          {news.summary}
                        </Typography>
                      </CardContent>
                    </Card>
                  </PandaCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default NewsPage; 