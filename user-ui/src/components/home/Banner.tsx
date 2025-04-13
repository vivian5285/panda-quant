import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Banner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #00bfae 0%, #004d2d 100%)',
        color: '#fff',
        py: 8,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 4,
          }}
        >
          <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 'bold',
                mb: 2,
                fontSize: { xs: '2rem', md: '3rem' },
              }}
            >
              注册即送 $50 抵扣券
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                opacity: 0.9,
                fontSize: { xs: '1rem', md: '1.25rem' },
              }}
            >
              立即加入,体验 AI 量化交易的魅力
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              sx={{
                bgcolor: '#fff',
                color: '#004d2d',
                '&:hover': {
                  bgcolor: '#f5f5f5',
                },
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
              }}
            >
              立即注册
            </Button>
          </Box>
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <Box
              component="img"
              src="/images/banner-illustration.svg"
              alt="Banner Illustration"
              sx={{
                maxWidth: '100%',
                height: 'auto',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
              }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Banner; 