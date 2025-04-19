import React from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Home as HomeIcon,
  ErrorOutline as ErrorIcon,
} from '@mui/icons-material';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          py: 4,
          background: 'linear-gradient(135deg, rgba(0, 255, 184, 0.02) 0%, rgba(0, 0, 0, 0) 100%)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 2,
              background: 'linear-gradient(135deg, rgba(0, 255, 184, 0.05) 0%, rgba(0, 0, 0, 0) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(0, 255, 184, 0.1)',
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                }}
              >
                <ErrorIcon
                  sx={{
                    fontSize: 80,
                    color: '#00FFB8',
                    mr: 2,
                  }}
                />
                <Typography
                  variant="h1"
                  component="h1"
                  sx={{
                    fontSize: '4rem',
                    fontWeight: 700,
                    background: 'linear-gradient(45deg, #00FFB8, #00CC93)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  404
                </Typography>
              </Box>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  color: '#333333',
                  mb: 2,
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -10,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '60px',
                    height: '4px',
                    background: 'linear-gradient(90deg, #00FFB8, transparent)',
                    borderRadius: '2px',
                  },
                }}
              >
                {t('notFound.title')}
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Typography
                color="text.secondary"
                sx={{
                  mb: 4,
                  fontSize: '1.1rem',
                  lineHeight: 1.6,
                }}
              >
                {t('notFound.message')}
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <Button
                variant="contained"
                onClick={() => navigate('/')}
                startIcon={<HomeIcon />}
                sx={{
                  bgcolor: '#00FFB8',
                  color: '#000000',
                  '&:hover': {
                    bgcolor: '#00CC93',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                }}
              >
                {t('notFound.backToHome')}
              </Button>
            </motion.div>
          </Paper>
        </motion.div>
      </Box>
    </Container>
  );
};

export default NotFound; 