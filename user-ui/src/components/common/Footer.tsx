import React from 'react';
import { Box, Typography, Link, Container } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Footer: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: 'background.paper',
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Panda Quant. All rights reserved.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              mt: { xs: 2, md: 0 },
            }}
          >
            <Link href="/terms" color="text.secondary" underline="hover">
              Terms
            </Link>
            <Link href="/privacy" color="text.secondary" underline="hover">
              Privacy
            </Link>
            <Link href="/contact" color="text.secondary" underline="hover">
              Contact
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 