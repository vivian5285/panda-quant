import React, { useState } from 'react';
import { Box, Typography, Grid, Container, Card, CardContent, Button, IconButton, List, ListItem, ListItemText, ListItemIcon, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import { themeUtils } from '../theme';
import { ContentCopy as ContentCopyIcon, Share as ShareIcon, CheckCircle as CheckCircleIcon, AttachMoney as MoneyIcon, People as PeopleIcon, AccessTime as TimeIcon, Login as LoginIcon, PersonAdd as RegisterIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const Invite: React.FC = () => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const { isAuthenticated } = useAuth();
  const inviteLink = isAuthenticated ? "https://pandaquant.com/invite/123456" : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: 8,
        background: 'linear-gradient(135deg, rgba(0, 255, 184, 0.05) 0%, rgba(0, 255, 184, 0.02) 100%)',
        position: 'relative',
      }}
    >
      <Container maxWidth="lg">
        <motion.div {...fadeInUp}>
          <Box
            sx={{
              textAlign: 'center',
              mb: 8,
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -20,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100px',
                height: '4px',
                background: 'linear-gradient(90deg, transparent, #00FFB8, transparent)',
                borderRadius: '2px',
              },
            }}
          >
            <Typography
              variant="h2"
              sx={{
                color: '#00FFB8',
                fontWeight: 800,
                fontSize: { xs: '2rem', md: '3rem' },
                lineHeight: 1.2,
                textShadow: '0 2px 10px rgba(0, 255, 184, 0.2)',
                mb: 2,
              }}
            >
              {t('invite.title')}
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: '#666666',
                fontWeight: 500,
                fontSize: { xs: '1rem', md: '1.2rem' },
                maxWidth: '800px',
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              {t('invite.subtitle')}
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 4,
                    boxShadow: '0 8px 32px rgba(0, 255, 184, 0.1)',
                    border: '1px solid rgba(0, 255, 184, 0.1)',
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        color: '#333333',
                        fontWeight: 600,
                        mb: 3,
                      }}
                    >
                      我的邀请链接
                    </Typography>
                    {isAuthenticated ? (
                      <>
                        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="body1"
                              sx={{
                                color: '#666666',
                                mb: 1,
                              }}
                            >
                              {inviteLink}
                            </Typography>
                          </Box>
                          <Button
                            onClick={handleCopy}
                            startIcon={copied ? <CheckCircleIcon /> : <ContentCopyIcon />}
                            variant="contained"
                            sx={{
                              bgcolor: '#00FFB8',
                              color: '#333333',
                              '&:hover': {
                                bgcolor: '#00E6A5',
                              },
                            }}
                          >
                            {copied ? '已复制' : '复制链接'}
                          </Button>
                        </Box>
                        <Typography
                          variant="body1"
                          sx={{
                            color: '#666666',
                          }}
                        >
                          {t('invite.link.description')}
                        </Typography>
                      </>
                    ) : (
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography
                          variant="body1"
                          sx={{
                            color: '#666666',
                            mb: 3,
                          }}
                        >
                          {t('invite.login_required', '登录后获取专属邀请链接')}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                          <Button
                            variant="contained"
                            href="/login"
                            startIcon={<LoginIcon />}
                            sx={{
                              bgcolor: '#00FFB8',
                              color: '#333333',
                              '&:hover': {
                                bgcolor: '#00E6A5',
                              },
                            }}
                          >
                            {t('invite.login', '立即登录')}
                          </Button>
                          <Button
                            variant="outlined"
                            href="/register"
                            startIcon={<RegisterIcon />}
                            sx={{
                              borderColor: '#00FFB8',
                              color: '#00FFB8',
                              '&:hover': {
                                borderColor: '#00E6A5',
                                bgcolor: 'rgba(0, 255, 184, 0.05)',
                              },
                            }}
                          >
                            注册账号
                          </Button>
                        </Box>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={6}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 4,
                    boxShadow: '0 8px 32px rgba(0, 255, 184, 0.1)',
                    border: '1px solid rgba(0, 255, 184, 0.1)',
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        color: '#333333',
                        fontWeight: 600,
                        mb: 3,
                      }}
                    >
                      {t('invite.reward.title')}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <MoneyIcon sx={{ fontSize: 40, color: '#00FFB8' }} />
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 700,
                          color: '#00FFB8',
                        }}
                      >
                        20%
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#666666',
                        mb: 3,
                      }}
                    >
                      {t('invite.reward.description')}
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <PeopleIcon sx={{ color: '#00FFB8' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={t('invite.benefits.0.level')}
                          secondary={t('invite.benefits.0.description')}
                        />
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <ListItemIcon>
                          <PeopleIcon sx={{ color: '#00FFB8' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={t('invite.benefits.1.level')}
                          secondary={t('invite.benefits.1.description')}
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            <Grid item xs={12}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  sx={{
                    borderRadius: 4,
                    boxShadow: '0 8px 32px rgba(0, 255, 184, 0.1)',
                    border: '1px solid rgba(0, 255, 184, 0.1)',
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        color: '#333333',
                        fontWeight: 600,
                        mb: 3,
                      }}
                    >
                      {t('invite.records.title')}
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <TimeIcon sx={{ color: '#00FFB8' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="实时返佣"
                          secondary="系统自动计算并发放返佣奖励"
                        />
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <ListItemIcon>
                          <MoneyIcon sx={{ color: '#00FFB8' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="多级分润"
                          secondary="支持多级邀请，收益持续增长"
                        />
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircleIcon sx={{ color: '#00FFB8' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="透明数据"
                          secondary="实时查看返佣记录，随时掌握收益情况"
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Invite; 