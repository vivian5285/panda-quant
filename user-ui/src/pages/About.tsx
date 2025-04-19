import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { themeUtils } from '../theme';
import { 
  Security as SecurityIcon,
  Speed as SpeedIcon,
  TrendingUp as TrendingUpIcon,
  Support as SupportIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';
import PandaCard from '../components/common/PandaCard';
import Layout from '../components/Layout';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const About: React.FC = () => {
  return (
    <Layout>
      <Box
        sx={{
          minHeight: '100vh',
          pt: 8,
          pb: 4,
          background: themeUtils.createGradient('background.default', 'background.paper'),
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("/background-pattern.png")',
            opacity: 0.1,
            zIndex: 0,
          },
        }}
      >
        <Box
          sx={{
            maxWidth: 'lg',
            mx: 'auto',
            px: 3,
          }}
        >
          <motion.div {...fadeInUp}>
            <Typography
              variant="h2"
              sx={{
                mb: 6,
                fontWeight: 700,
                background: themeUtils.createGradient('primary'),
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textAlign: 'center',
                fontSize: { xs: '2.5rem', md: '3rem' },
              }}
            >
              关于我们
            </Typography>

            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <PandaCard
                    sx={{
                      height: '100%',
                      p: 4,
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        mb: 2,
                        fontWeight: 600,
                        color: 'primary.main',
                      }}
                    >
                      公司简介
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'text.secondary',
                        mb: 2,
                      }}
                    >
                      PandaQuant是一家专注于量化交易的技术公司，致力于为用户提供安全、高效、智能的交易解决方案。
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'text.secondary',
                      }}
                    >
                      我们的团队由经验丰富的金融专家和技术精英组成，通过先进的算法和强大的技术支持，帮助用户实现稳定的收益增长。
                    </Typography>
                  </PandaCard>
                </motion.div>
              </Grid>

              <Grid item xs={12} md={6}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <PandaCard
                    sx={{
                      height: '100%',
                      p: 4,
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        mb: 2,
                        fontWeight: 600,
                        color: 'primary.main',
                      }}
                    >
                      我们的优势
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <SecurityIcon sx={{ color: 'primary.main', mr: 1 }} />
                          <Typography variant="body1">安全可靠</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <SpeedIcon sx={{ color: 'primary.main', mr: 1 }} />
                          <Typography variant="body1">高效稳定</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <TrendingUpIcon sx={{ color: 'primary.main', mr: 1 }} />
                          <Typography variant="body1">收益可观</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <SupportIcon sx={{ color: 'primary.main', mr: 1 }} />
                          <Typography variant="body1">专业服务</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </PandaCard>
                </motion.div>
              </Grid>

              <Grid item xs={12}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <PandaCard
                    sx={{
                      height: '100%',
                      p: 4,
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        mb: 2,
                        fontWeight: 600,
                        color: 'primary.main',
                      }}
                    >
                      联系我们
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <EmailIcon sx={{ color: 'primary.main', mr: 1 }} />
                          <Typography variant="body1">support@pandaquant.com</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <PhoneIcon sx={{ color: 'primary.main', mr: 1 }} />
                          <Typography variant="body1">+86 123 4567 8900</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocationIcon sx={{ color: 'primary.main', mr: 1 }} />
                          <Typography variant="body1">上海市浦东新区</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </PandaCard>
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        </Box>
      </Box>
    </Layout>
  );
};

export default About; 