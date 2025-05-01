import React from 'react';
import { Box, Container, Grid, Typography, Button, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import PandaCard from '@/components/common/PandaCard';
import { GradientTitle } from '@/components/common/GradientTitle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import { useTranslation } from 'react-i18next';

const StyledPricingCard = styled(PandaCard)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
  },
}));

const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleStartClick = () => {
    navigate('/login');
  };

  const features = [
    {
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: '#00FFB8' }} />,
      title: '高收益',
      description: '月化收益50%-300%，让您的资金快速增值',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: '#00FFB8' }} />,
      title: '低风险',
      description: '严格的风险控制体系，保障您的资金安全',
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40, color: '#00FFB8' }} />,
      title: '高效率',
      description: '7x24小时自动化交易，不错过任何机会',
    },
  ];

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <GradientTitle 
          title={t('pricing.title', '定价方案')} 
          variant="h2" 
          align="center" 
          sx={{ mb: 6 }}
        >
          {t('pricing.title', '定价方案')}
        </GradientTitle>
        
        <Typography 
          variant="h5" 
          align="center"
          sx={{ 
            mb: 8,
            color: '#00FFB8',
            fontWeight: 'medium',
          }}
        >
          我们只收取收益的10%，让您获得最大收益
        </Typography>

        <Grid container spacing={4} sx={{ mb: 8 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Box sx={{ textAlign: 'center' }}>
                {feature.icon}
                <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {feature.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <StyledPricingCard>
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
              收益分成
            </Typography>
            <Typography variant="h3" sx={{ color: '#00FFB8', mb: 2 }}>
              收益的10%
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              无基础费用，无隐藏收费
            </Typography>
            <Divider sx={{ my: 3 }} />
            <Typography variant="body1" paragraph>
              • 月化收益50%-300%
            </Typography>
            <Typography variant="body1" paragraph>
              • 收益实时结算，透明可查
            </Typography>
            <Typography variant="body1" paragraph>
              • 支持多种交易策略
            </Typography>
            <Typography variant="body1" paragraph>
              • 24/7 专业团队支持
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={handleStartClick}
              sx={{
                mt: 4,
                bgcolor: '#00FFB8',
                color: 'black',
                '&:hover': {
                  bgcolor: '#00E6A5',
                },
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
              }}
            >
              立即开始
            </Button>
          </Box>
        </StyledPricingCard>
      </Container>
    </Box>
  );
};

export default PricingPage; 