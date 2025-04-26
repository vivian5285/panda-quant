import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemIcon,
  useTheme,
  Chip,
} from '@mui/material';
import { motion } from 'framer-motion';
import { themeUtils } from '../../theme';
import CheckIcon from '@mui/icons-material/Check';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SecurityIcon from '@mui/icons-material/Security';
import PsychologyIcon from '@mui/icons-material/Psychology';
import ApiIcon from '@mui/icons-material/Api';

const PricingPage = () => {
  const theme = useTheme();

  const plans = [
    {
      name: '基础版',
      price: '10%',
      period: '盈利分成',
      description: '适合新手入门，体验量化交易',
      features: [
        '基础交易策略',
        '实时行情数据',
        '基础技术指标',
        '社区支持',
        '每日交易限额',
      ],
      cta: '立即开始',
      popular: false,
    },
    {
      name: '专业版',
      price: '10%',
      period: '盈利分成',
      description: '适合专业交易者，提供更多高级功能',
      features: [
        '所有基础版功能',
        '高级交易策略',
        'API接口访问',
        '自定义指标',
        '优先客服支持',
        '无交易限额',
        '数据分析工具',
      ],
      cta: '升级专业版',
      popular: true,
    },
    {
      name: '企业版',
      price: '10%',
      period: '盈利分成',
      description: '适合机构用户，提供定制化服务',
      features: [
        '所有专业版功能',
        '专属客户经理',
        '定制化策略开发',
        '私有化部署',
        '高级API支持',
        '团队协作功能',
        '专属服务器',
        '7x24小时技术支持',
      ],
      cta: '联系销售',
      popular: false,
    },
  ];

  const features = [
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
            价格方案
          </Typography>
          <Typography
            variant="h5"
            sx={{
              textAlign: 'center',
              color: '#666666',
              mb: 8,
              maxWidth: '800px',
              mx: 'auto',
              fontSize: { xs: '1.1rem', md: '1.3rem' },
            }}
          >
            我们只收取盈利部分的10%作为托管费，让您无后顾之忧
          </Typography>
        </motion.div>

        <Grid container spacing={4} sx={{ mb: 8 }}>
          {plans.map((plan, index) => (
            <Grid item xs={12} md={4} key={plan.name}>
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
                    position: 'relative',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 8px 30px rgba(0, 255, 184, 0.15)',
                      border: '1px solid rgba(0, 255, 184, 0.2)',
                    },
                    ...(plan.popular && {
                      border: '2px solid #00FFB8',
                      '&::before': {
                        content: '"最受欢迎"',
                        position: 'absolute',
                        top: -12,
                        right: 20,
                        background: '#00FFB8',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                      },
                    }),
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 700,
                          mb: 1,
                          background: 'linear-gradient(45deg, #00FFB8 30%, #00B8FF 90%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        {plan.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
                        <Typography
                          variant="h3"
                          sx={{
                            fontWeight: 700,
                            mr: 1,
                            background: 'linear-gradient(45deg, #00FFB8 30%, #00B8FF 90%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }}
                        >
                          {plan.price}
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#666666' }}>
                          /{plan.period}
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ color: '#666666' }}>
                        {plan.description}
                      </Typography>
                    </Box>

                    <List sx={{ mb: 3 }}>
                      {plan.features.map((feature) => (
                        <ListItem key={feature} sx={{ px: 0, py: 1 }}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <CheckIcon sx={{ color: '#00FFB8' }} />
                          </ListItemIcon>
                          <Typography variant="body1" sx={{ color: '#333333' }}>
                            {feature}
                          </Typography>
                        </ListItem>
                      ))}
                    </List>

                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        background: 'linear-gradient(45deg, #00FFB8 30%, #00B8FF 90%)',
                        color: 'white',
                        py: 1.5,
                        borderRadius: '12px',
                        fontWeight: 600,
                        '&:hover': {
                          background: 'linear-gradient(45deg, #00CC93 30%, #0096CC 90%)',
                        },
                      }}
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h4"
            sx={{
              mb: 4,
              background: 'linear-gradient(45deg, #00FFB8 30%, #00B8FF 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
            }}
          >
            所有方案都包含
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={feature.title}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: '16px',
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                      border: '1px solid rgba(0, 255, 184, 0.1)',
                      height: '100%',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 2,
                        color: '#00FFB8',
                      }}
                    >
                      {feature.icon}
                      <Typography
                        variant="h6"
                        sx={{
                          ml: 2,
                          fontWeight: 700,
                          background: 'linear-gradient(45deg, #00FFB8 30%, #00B8FF 90%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        {feature.title}
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ color: '#666666' }}>
                      {feature.description}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box
          sx={{
            textAlign: 'center',
            p: 4,
            borderRadius: '24px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(0, 255, 184, 0.1)',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              mb: 2,
              background: 'linear-gradient(45deg, #00FFB8 30%, #00B8FF 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
            }}
          >
            需要定制化方案？
          </Typography>
          <Typography variant="body1" sx={{ color: '#666666', mb: 3 }}>
            我们的销售团队将为您提供专业的咨询服务
          </Typography>
          <Button
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #00FFB8 30%, #00B8FF 90%)',
              color: 'white',
              py: 1.5,
              px: 4,
              borderRadius: '12px',
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(45deg, #00CC93 30%, #0096CC 90%)',
              },
            }}
          >
            联系销售
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default PricingPage; 