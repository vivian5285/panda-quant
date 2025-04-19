import React from 'react';
import {
  Box,
  Typography,
  Container,
  useTheme,
} from '@mui/material';

const Footer: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          {'© '}
          {new Date().getFullYear()}
          {' Panda Quant. All rights reserved.'}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 