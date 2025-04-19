import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { themeUtils } from '../theme';
import PandaCard from '../components/common/PandaCard';
import Layout from '../components/Layout';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const Profit: React.FC = () => {
  const { t } = useTranslation();

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
              {t('profit.title')}
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
                      {t('profit.total.title')}
                    </Typography>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        background: themeUtils.createGradient('primary'),
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      $12,345.67
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        mt: 2,
                        color: 'text.secondary',
                      }}
                    >
                      {t('profit.total.description', { percent: '15.8' })}
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
                      {t('profit.monthly.title')}
                    </Typography>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        background: themeUtils.createGradient('primary'),
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      $3,456.78
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        mt: 2,
                        color: 'text.secondary',
                      }}
                    >
                      {t('profit.monthly.description', { percent: '8.2' })}
                    </Typography>
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
                      {t('profit.trend.title')}
                    </Typography>
                    {/* 这里可以添加收益趋势图表 */}
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

export default Profit; 