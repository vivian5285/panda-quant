import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  useTheme,
} from '@mui/material';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';
import { motion } from 'framer-motion';
import { themeUtils } from '../../theme';

const Footer = () => {
  const theme = useTheme();

  const footerLinks = [
    {
      title: '产品',
      links: [
        { text: '交易策略', href: '/product/strategies' },
        { text: '量化交易', href: '/product/quant' },
        { text: 'API文档', href: '/product/api' },
        { text: '价格方案', href: '/product/pricing' },
      ],
    },
    {
      title: '资源',
      links: [
        { text: '帮助中心', href: '/resources/help' },
        { text: '博客', href: '/resources/blog' },
        { text: '社区', href: '/resources/community' },
        { text: '更新日志', href: '/resources/changelog' },
      ],
    },
    {
      title: '公司',
      links: [
        { text: '关于我们', href: '/about' },
        { text: '新闻动态', href: '/about/news' },
        { text: '团队介绍', href: '/about/team' },
        { text: '加入我们', href: '/about/careers' },
        { text: '合作伙伴', href: '/about/partners' },
        { text: '联系我们', href: '/about/contact' },
      ],
    },
    {
      title: '法律',
      links: [
        { text: '服务条款', href: '/legal/terms' },
        { text: '隐私政策', href: '/legal/privacy' },
        { text: 'Cookie政策', href: '/legal/cookies' },
        { text: '风险提示', href: '/legal/risk' },
        { text: '免责声明', href: '/legal/disclaimer' },
      ],
    },
  ];

  const socialLinks = [
    { icon: <TelegramIcon />, href: 'https://t.me/pandaquant', label: 'Telegram' },
    { icon: <TwitterIcon />, href: 'https://twitter.com/pandaquant', label: 'Twitter' },
    { icon: <GitHubIcon />, href: 'https://github.com/pandaquant', label: 'GitHub' },
    { icon: <EmailIcon />, href: 'mailto:contact@pandaquant.com', label: 'Email' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        py: { xs: 4, sm: 6, md: 8 },
        bgcolor: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(0, 255, 184, 0.05) 0%, rgba(0, 255, 184, 0.02) 100%)',
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ 
          maxWidth: '1200px',
          mx: 'auto',
          width: '100%',
        }}>
          <Grid container spacing={{ xs: 3, sm: 4 }}>
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: themeUtils.animationConfig.duration.medium }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: { xs: 2, sm: 3 },
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#00FFB8',
                      fontWeight: 700,
                      fontSize: { xs: '1.2rem', sm: '1.5rem' },
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <span style={{ fontSize: { xs: '1.5rem', sm: '1.8rem' } }}>🐼</span>
                    <span style={{
                      background: 'linear-gradient(45deg, #00FFB8 30%, #00CC93 90%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}>
                      Panda Quant
                    </span>
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#666666',
                    mb: { xs: 2, sm: 3 },
                    maxWidth: '300px',
                    fontSize: { xs: '0.875rem', sm: '0.9rem' },
                  }}
                >
                  专业的量化交易平台，为投资者提供智能、高效、安全的交易解决方案。
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    gap: { xs: 1.5, sm: 2 },
                  }}
                >
                  {socialLinks.map((social, index) => (
                    <motion.div
                      key={social.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: themeUtils.animationConfig.duration.medium,
                        delay: index * 0.1,
                      }}
                    >
                      <IconButton
                        component="a"
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          color: '#00FFB8',
                          bgcolor: 'rgba(0, 255, 184, 0.1)',
                          '&:hover': {
                            bgcolor: 'rgba(0, 255, 184, 0.2)',
                            transform: 'translateY(-2px)',
                          },
                          transition: 'all 0.3s ease',
                          width: { xs: 36, sm: 40 },
                          height: { xs: 36, sm: 40 },
                        }}
                      >
                        {social.icon}
                      </IconButton>
                    </motion.div>
                  ))}
                </Box>
              </motion.div>
            </Grid>

            {footerLinks.map((section, index) => (
              <Grid item xs={6} sm={3} md={2} key={section.title}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: themeUtils.animationConfig.duration.medium,
                    delay: index * 0.1,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: '#333333',
                      fontWeight: 600,
                      mb: { xs: 1.5, sm: 2 },
                      position: 'relative',
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -8,
                        left: 0,
                        width: '30px',
                        height: '2px',
                        background: 'linear-gradient(90deg, #00FFB8, transparent)',
                      },
                    }}
                  >
                    {section.title}
                  </Typography>
                  <Box
                    component="ul"
                    sx={{
                      listStyle: 'none',
                      p: 0,
                      m: 0,
                    }}
                  >
                    {section.links.map((link) => (
                      <Box
                        component="li"
                        key={link.text}
                        sx={{
                          mb: { xs: 1, sm: 1.5 },
                        }}
                      >
                        <Link
                          href={link.href}
                          sx={{
                            color: '#666666',
                            textDecoration: 'none',
                            transition: 'all 0.3s ease',
                            fontSize: { xs: '0.8rem', sm: '0.875rem' },
                            '&:hover': {
                              color: '#00FFB8',
                              transform: 'translateX(5px)',
                            },
                          }}
                        >
                          {link.text}
                        </Link>
                      </Box>
                    ))}
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          <Box
            sx={{
              mt: { xs: 4, sm: 6 },
              pt: { xs: 3, sm: 4 },
              borderTop: '1px solid rgba(0, 255, 184, 0.1)',
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#666666',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  }}
                >
                  © {new Date().getFullYear()} Panda Quant. All rights reserved.
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: { xs: 'flex-start', md: 'flex-end' },
                    gap: { xs: 2, sm: 3 },
                    flexWrap: 'wrap',
                  }}
                >
                  <Link
                    href="/terms"
                    sx={{
                      color: '#666666',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      '&:hover': {
                        color: '#00FFB8',
                      },
                    }}
                  >
                    服务条款
                  </Link>
                  <Link
                    href="/privacy"
                    sx={{
                      color: '#666666',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      '&:hover': {
                        color: '#00FFB8',
                      },
                    }}
                  >
                    隐私政策
                  </Link>
                  <Link
                    href="/risk"
                    sx={{
                      color: '#666666',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      '&:hover': {
                        color: '#00FFB8',
                      },
                    }}
                  >
                    风险提示
                  </Link>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 