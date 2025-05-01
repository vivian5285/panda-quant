import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Error as ErrorIcon } from '@mui/icons-material';
import theme from '../theme';
import { animationConfig } from '../theme/animation';

const NotFound: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: animationConfig.duration.medium }}
      >
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            py: 4,
            textAlign: 'center',
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: animationConfig.duration.medium,
              delay: 0.2,
            }}
          >
            <ErrorIcon
              sx={{
                fontSize: 120,
                color: theme.palette.error.main,
                mb: 4,
              }}
            />
          </motion.div>

          <Typography
            variant="h1"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '3rem', sm: '4rem', md: '5rem' },
              color: theme.palette.text.primary,
              mb: 2,
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -10,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100px',
                height: '4px',
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                borderRadius: '2px',
              },
            }}
          >
            404
          </Typography>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 500,
              color: theme.palette.text.secondary,
              mb: 4,
            }}
          >
            {t('notFound.title')}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
              mb: 4,
              maxWidth: 600,
            }}
          >
            {t('notFound.description')}
          </Typography>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="contained"
              onClick={() => navigate('/')}
              sx={{
                py: 1.5,
                px: 4,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                '&:hover': {
                  background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                },
              }}
            >
              {t('notFound.backToHome')}
            </Button>
          </motion.div>
        </Box>
      </motion.div>
    </Container>
  );
};

export default NotFound; 