import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const TeamPage: React.FC = () => {
  const { t } = useTranslation();

  const teamMembers = [
    {
      name: 'Michael Johnson',
      role: 'Founder & CEO',
      bio: 'With 10 years of experience in quantitative trading, previously served as a senior quantitative analyst at several renowned financial institutions.',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJ1c2luZXNzJTIwbWFufGVufDB8fDB8fHww'
    },
    {
      name: 'David Wilson',
      role: 'CTO',
      bio: 'Specialized in blockchain and smart contract development, with extensive experience in distributed systems.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGJ1c2luZXNzJTIwbWFufGVufDB8fDB8fHww'
    },
    {
      name: 'Sarah Anderson',
      role: 'Product Director',
      bio: 'Responsible for product strategy and user experience, committed to building the best quantitative trading platform.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGJ1c2luZXNzJTIwd29tYW58ZW58MHx8MHx8fDA%3D'
    },
    {
      name: 'Kevin Taylor',
      role: 'Quantitative Strategy Director',
      bio: 'Focused on high-frequency trading strategy development, with deep expertise in algorithmic trading.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGJ1c2luZXNzJTIwbWFufGVufDB8fDB8fHww'
    }
  ];

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h2"
            component="h1"
            align="center"
            gutterBottom
            sx={{ fontWeight: 'bold', mb: 4 }}
          >
            Our Team
          </Typography>
          <Typography
            variant="h5"
            align="center"
            color="text.secondary"
            sx={{ mb: 8 }}
          >
            An elite team of industry experts dedicated to providing you with the most professional quantitative trading services
          </Typography>
        </motion.div>

        <Grid container spacing={4}>
          {teamMembers.map((member, index) => (
            <Grid item xs={12} sm={6} md={3} key={member.name}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 24px rgba(0, 255, 184, 0.15)',
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                    <Avatar
                      src={member.avatar}
                      alt={member.name}
                      sx={{
                        width: 120,
                        height: 120,
                        mx: 'auto',
                        mb: 3,
                        border: '3px solid #00FFB8',
                      }}
                    />
                    <Typography variant="h6" gutterBottom>
                      {member.name}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      color="primary"
                      sx={{ mb: 2, color: '#00FFB8' }}
                    >
                      {member.role}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {member.bio}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Join Us
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            We are looking for like-minded partners to build the future of quantitative trading together
          </Typography>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Typography
              variant="h6"
              color="primary"
              sx={{
                cursor: 'pointer',
                display: 'inline-block',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              View Open Positions →
            </Typography>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default TeamPage; 