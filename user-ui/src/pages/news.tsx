import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent } from '@mui/material';
import { GradientTitle } from '@/components/common/GradientTitle';
import PandaCard from '@/components/common/PandaCard';
import { motion } from 'framer-motion';

const NewsPage: React.FC = () => {
  const newsItems = [
    {
      id: 1,
      title: '熊猫量化完成A轮融资',
      date: '2024-03-15',
      summary: '熊猫量化宣布完成A轮融资，由知名投资机构领投，将用于技术研发和市场拓展。',
      category: '公司动态',
    },
    {
      id: 2,
      title: '新策略上线：超级趋势2.0',
      date: '2024-03-10',
      summary: '我们发布了全新的超级趋势2.0策略，采用先进的机器学习算法，提供更精准的交易信号。',
      category: '产品更新',
    },
    {
      id: 3,
      title: '与Binance达成战略合作',
      date: '2024-03-05',
      summary: '熊猫量化与Binance达成战略合作，为用户提供更优质的交易体验和更低的交易成本。',
      category: '合作动态',
    },
    {
      id: 4,
      title: '用户突破10万',
      date: '2024-02-28',
      summary: '熊猫量化平台用户数突破10万，感谢所有用户的支持和信任。',
      category: '里程碑',
    },
  ];

  return (
    <Box sx={{ 
      py: { xs: 4, md: 8 },
      background: 'linear-gradient(135deg, rgba(0, 255, 184, 0.05) 0%, rgba(0, 255, 184, 0.02) 100%)',
      minHeight: '100vh',
    }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <GradientTitle 
            title="新闻动态"
            sx={{ 
              mb: { xs: 3, md: 4 },
              fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
              fontWeight: 700,
              textAlign: 'center',
            }}
          />
          <Typography 
            variant="subtitle1" 
            align="center" 
            sx={{ 
              mb: { xs: 4, md: 6 },
              color: 'text.secondary',
              maxWidth: '800px',
              mx: 'auto',
              fontSize: { xs: '0.9rem', sm: '1rem' },
              lineHeight: 1.6,
            }}
          >
            了解熊猫量化的最新动态
          </Typography>
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
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
            {newsItems.map((news, index) => (
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
                      minHeight: { xs: '200px', sm: '220px', md: '240px' },
                      transition: 'all 0.3s ease',
                      borderRadius: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: `0 8px 24px rgba(0, 0, 0, 0.15)`,
                      },
                    }}>
                      <CardContent sx={{ 
                        p: { xs: 3, sm: 4 },
                        '&:last-child': { pb: { xs: 3, sm: 4 } },
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                      }}>
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          mb: 2.5,
                        }}>
                          <Typography 
                            variant="caption" 
                            color="text.secondary"
                            sx={{ 
                              fontSize: { xs: '0.75rem', sm: '0.8rem' },
                              fontWeight: 500,
                            }}
                          >
                            {news.date}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              bgcolor: 'rgba(0, 255, 184, 0.1)',
                              color: '#00FFB8',
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 1,
                              fontSize: { xs: '0.75rem', sm: '0.8rem' },
                              fontWeight: 600,
                            }}
                          >
                            {news.category}
                          </Typography>
                        </Box>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            mb: 2,
                            fontSize: { xs: '1.1rem', sm: '1.2rem' },
                            fontWeight: 600,
                            lineHeight: 1.4,
                          }}
                        >
                          {news.title}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            fontSize: { xs: '0.875rem', sm: '0.9rem' },
                            lineHeight: 1.6,
                            flex: 1,
                          }}
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