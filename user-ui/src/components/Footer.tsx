import React from 'react';
import { Box, Typography, Container, Link } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} 熊猫量化. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: { xs: 2, sm: 0 } }}>
            <Link href="#" color="inherit" underline="hover">
              关于我们
            </Link>
            <Link href="#" color="inherit" underline="hover">
              联系我们
            </Link>
            <Link href="#" color="inherit" underline="hover">
              隐私政策
            </Link>
            <Link href="#" color="inherit" underline="hover">
              服务条款
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 