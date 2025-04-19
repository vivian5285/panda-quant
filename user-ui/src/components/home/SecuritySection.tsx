import React from 'react';
import { Box, Typography, Grid, Container } from '@mui/material';
import { motion } from 'framer-motion';

const SecuritySection: React.FC = () => {
  const securityFeatures = [
    {
      title: '资金安全',
      description: '采用多重加密技术，确保用户资金安全',
      icon: '🔒',
    },
    {
      title: '风险控制',
      description: '严格的风险控制体系，保护用户投资安全',
      icon: '🛡️',
    },
    {
      title: '数据加密',
      description: '所有数据采用端到端加密，确保隐私安全',
      icon: '🔐',
    },
  ];

  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        display: 'flex',
        alignItems: 'center',
        overflow: 'visible',
        bgcolor: '#FFFFFF',
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              fontWeight: 700,
              textAlign: 'center',
              mb: 2,
              color: '#00FFB8',
              textShadow: '0 0 10px rgba(0, 255, 184, 0.3)',
            }}
          >
            安全保障
          </Typography>
          <Typography
            variant="h4"
            sx={{
              color: '#666666',
              textAlign: 'center',
              mb: { xs: 4, md: 8 },
              maxWidth: '800px',
              mx: 'auto',
              fontWeight: 400,
              fontSize: { xs: '1.25rem', md: '1.5rem' },
            }}
          >
            多重安全防护，让投资更安心
          </Typography>
        </motion.div>

        <Grid container spacing={{ xs: 3, md: 4 }}>
          {securityFeatures.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ scale: 1.02 }}
              >
                <Box
                  sx={{
                    p: { xs: 3, md: 4 },
                    borderRadius: 3,
                    bgcolor: '#FFFFFF',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
                    height: '100%',
                    transition: 'all 0.3s ease',
                    border: '1px solid rgba(0, 255, 184, 0.1)',
                    '&:hover': {
                      bgcolor: 'rgba(0, 255, 184, 0.05)',
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 40px rgba(0, 255, 184, 0.15)',
                      borderColor: 'rgba(0, 255, 184, 0.3)',
                    },
                  }}
                >
                  <Typography
                    variant="h1"
                    sx={{
                      mb: 3,
                      fontSize: { xs: '2.5rem', md: '3rem' },
                      textAlign: 'center',
                      color: '#00FFB8',
                      textShadow: '0 0 10px rgba(0, 255, 184, 0.3)',
                    }}
                  >
                    {feature.icon}
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      mb: 2,
                      textAlign: 'center',
                      color: '#00FFB8',
                      fontWeight: 600,
                      fontSize: { xs: '1.25rem', md: '1.5rem' },
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      textAlign: 'center',
                      color: '#666666',
                      lineHeight: 1.8,
                      fontSize: { xs: '0.9rem', md: '1rem' },
                    }}
                  >
                    {feature.description}
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default SecuritySection; 