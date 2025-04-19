import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  Link,
  Grid,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { themeUtils } from '../theme';

const Footer: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  // 使用 useMemo 缓存页脚链接数据，当语言变化时重新计算
  const footerLinks = useMemo(() => [
    {
      title: t('footer.about.title'),
      links: [
        { text: t('footer.about.company'), href: '/about' },
        { text: t('footer.about.team'), href: '/team' },
        { text: t('footer.about.careers'), href: '/careers' },
        { text: t('footer.about.blog'), href: '/blog' },
      ],
    },
    {
      title: t('footer.product.title'),
      links: [
        { text: t('footer.product.features'), href: '/features' },
        { text: t('footer.product.pricing'), href: '/pricing' },
        { text: t('footer.product.api'), href: '/api' },
        { text: t('footer.product.status'), href: '/status' },
      ],
    },
    {
      title: t('footer.resources.title'),
      links: [
        { text: t('footer.resources.documentation'), href: '/docs' },
        { text: t('footer.resources.guides'), href: '/guides' },
        { text: t('footer.resources.support'), href: '/support' },
        { text: t('footer.resources.community'), href: '/community' },
      ],
    },
    {
      title: t('footer.legal.title'),
      links: [
        { text: t('footer.legal.privacy'), href: '/privacy' },
        { text: t('footer.legal.terms'), href: '/terms' },
        { text: t('footer.legal.cookies'), href: '/cookies' },
        { text: t('footer.legal.licenses'), href: '/licenses' },
      ],
    },
  ], [t]);

  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: { xs: 2, md: 4 },
        background: theme.palette.mode === 'dark'
          ? 'rgba(0, 0, 0, 0.5)'
          : 'rgba(255, 255, 255, 0.5)',
        borderTop: `1px solid ${
          theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(0, 0, 0, 0.1)'
        }`,
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <Grid container spacing={4}>
          {footerLinks.map((section, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  color: theme.palette.mode === 'dark' ? 'white' : 'text.primary',
                  fontWeight: 600,
                }}
              >
                {section.title}
              </Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                {section.links.map((link, linkIndex) => (
                  <Box component="li" key={linkIndex} sx={{ mb: 1 }}>
                    <Link
                      href={link.href}
                      sx={{
                        color: theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.7)'
                          : 'rgba(0, 0, 0, 0.7)',
                        textDecoration: 'none',
                        '&:hover': {
                          color: theme.palette.primary.main,
                        },
                      }}
                    >
                      {link.text}
                    </Link>
                  </Box>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Box
          sx={{
            mt: 6,
            pt: 4,
            borderTop: `1px solid ${
              theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(0, 0, 0, 0.1)'
            }`,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.7)'
                : 'rgba(0, 0, 0, 0.7)',
            }}
          >
            © {new Date().getFullYear()} PandaQuant. {t('footer.copyright')}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              gap: 2,
            }}
          >
            <Link
              href="/privacy"
              sx={{
                color: theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.7)'
                  : 'rgba(0, 0, 0, 0.7)',
                textDecoration: 'none',
                '&:hover': {
                  color: theme.palette.primary.main,
                },
              }}
            >
              {t('footer.privacy')}
            </Link>
            <Link
              href="/terms"
              sx={{
                color: theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.7)'
                  : 'rgba(0, 0, 0, 0.7)',
                textDecoration: 'none',
                '&:hover': {
                  color: theme.palette.primary.main,
                },
              }}
            >
              {t('footer.terms')}
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer; 