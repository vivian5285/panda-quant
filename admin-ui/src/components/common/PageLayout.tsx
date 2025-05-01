import React from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { animationConfig } from '../../theme/animation';
import theme from '../../theme';

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  filters?: React.ReactNode;
  content?: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ title, children, actions, filters, content }) => {
  return (
    <Container maxWidth="lg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={animationConfig.spring}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -8,
                left: 0,
                width: '100%',
                height: 2,
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              },
            }}
          >
            {title}
          </Typography>
          {actions}
        </Box>
        {filters}
        {content || (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            {React.Children.map(children, (child, index) => (
              <Box>{child}</Box>
            ))}
          </Box>
        )}
      </motion.div>
    </Container>
  );
};

export default PageLayout; 