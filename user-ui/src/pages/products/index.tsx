import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { themeUtils } from '../../theme';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SecurityIcon from '@mui/icons-material/Security';
import PsychologyIcon from '@mui/icons-material/Psychology';
import ApiIcon from '@mui/icons-material/Api';

const ProductsPage = () => {
  const theme = useTheme();
  const products = [
    {
      title: '量化交易',
      description: '专业的量化交易平台，提供多种交易策略和工具',
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
    },
    {
      title: 'API接口',
      description: '强大的API接口，支持自定义交易策略和自动化交易',
      icon: <ApiIcon sx={{ fontSize: 40 }} />,
    },
    {
      title: '交易策略',
      description: '丰富的交易策略库，满足不同投资者的需求',
      icon: <PsychologyIcon sx={{ fontSize: 40 }} />,
    },
    {
      title: '安全保障',
      description: '多重安全机制，保障用户资产安全',
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
    },
  ];

  return (
    <Box
      sx={{
        background: themeUtils.createGradient(
          theme.palette.background.default,
          theme.palette.background.paper
        ),
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 50% 0%, rgba(0, 255, 184, 0.1) 0%, rgba(0, 255, 184, 0) 50%)',
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h2"
            component="h1"
            sx={{
              textAlign: 'center',
              mb: 6,
              background: 'linear-gradient(45deg, #00FFB8 30%, #00B8FF 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
              fontSize: { xs: '2.2rem', md: '3.5rem' },
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -12,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60px',
                height: '3px',
                background: 'linear-gradient(90deg, transparent, #00FFB8, transparent)',
                borderRadius: '2px',
              },
            }}
          >
            产品介绍
          </Typography>
        </motion.div>

        <Grid container spacing={4}>
          {products.map((product, index) => (
            <Grid item xs={12} sm={6} md={3} key={product.title}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '24px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(0, 255, 184, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 8px 30px rgba(0, 255, 184, 0.15)',
                      border: '1px solid rgba(0, 255, 184, 0.2)',
                    },
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 2,
                        color: '#00FFB8',
                      }}
                    >
                      {product.icon}
                      <Typography
                        variant="h5"
                        sx={{
                          ml: 2,
                          fontWeight: 700,
                          background: 'linear-gradient(45deg, #00FFB8 30%, #00B8FF 90%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        {product.title}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#666666',
                        fontSize: '1.1rem',
                        lineHeight: 1.8,
                      }}
                    >
                      {product.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default ProductsPage; 