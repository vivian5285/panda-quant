import React, { useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { themeUtils } from '../theme';
import { ContentCopy as ContentCopyIcon } from '@mui/icons-material';
import PandaCard from '../components/common/PandaCard';
import PandaButton from '../components/common/PandaButton';
import PandaInput from '../components/common/PandaInput';
import Layout from '../components/Layout';
import { useTranslation } from 'react-i18next';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const Invite: React.FC = () => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const inviteLink = "https://pandaquant.com/invite/123456";

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
              {t('invite.title')}
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
                      {t('invite.link.title')}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                      <PandaInput
                        fullWidth
                        value={inviteLink}
                        readOnly
                      />
                      <PandaButton
                        onClick={handleCopy}
                        startIcon={<ContentCopyIcon />}
                        variant="contained"
                      >
                        {copied ? t('invite.link.copied') : t('invite.link.copy')}
                      </PandaButton>
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'text.secondary',
                      }}
                    >
                      {t('invite.link.description')}
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
                      {t('invite.reward.title')}
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
                      10%
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        mt: 2,
                        color: 'text.secondary',
                      }}
                    >
                      {t('invite.reward.description')}
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
                      {t('invite.records.title')}
                    </Typography>
                    {/* 这里可以添加邀请记录列表 */}
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

export default Invite; 