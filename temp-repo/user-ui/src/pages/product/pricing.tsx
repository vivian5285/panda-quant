import React from 'react';
import { Box, Container, Grid, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import PandaCard from '../../components/common/PandaCard';
import { GradientTitle } from '../../components/common/GradientTitle';

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
  return (
    <Box sx={{ py: 8, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Box textAlign="center" mb={8}>
          <GradientTitle variant="h2" component="h1" gutterBottom>
            透明定价，共赢未来
          </GradientTitle>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
            我们只收取收益的10%，让您获得最大收益
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <StyledPricingCard>
              <Box p={4}>
                <Typography variant="h4" gutterBottom>
                  基础版
                </Typography>
                <Typography variant="h3" color="primary" gutterBottom>
                  收益的10%
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  月化收益50%-300%
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  sx={{ mt: 2 }}
                >
                  立即开始
                </Button>
              </Box>
            </StyledPricingCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <StyledPricingCard>
              <Box p={4}>
                <Typography variant="h4" gutterBottom>
                  专业版
                </Typography>
                <Typography variant="h3" color="primary" gutterBottom>
                  收益的10%
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  月化收益50%-300%
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  sx={{ mt: 2 }}
                >
                  立即开始
                </Button>
              </Box>
            </StyledPricingCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <StyledPricingCard>
              <Box p={4}>
                <Typography variant="h4" gutterBottom>
                  企业版
                </Typography>
                <Typography variant="h3" color="primary" gutterBottom>
                  收益的10%
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  月化收益50%-300%
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  sx={{ mt: 2 }}
                >
                  立即开始
                </Button>
              </Box>
            </StyledPricingCard>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default PricingPage; 