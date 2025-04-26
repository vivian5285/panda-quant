import React from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { Breadcrumbs as MuiBreadcrumbs, Link, Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();
  
  const pathnames = location.pathname.split('/').filter((x) => x);
  
  // 排除不需要显示面包屑的路径
  const excludedPaths = ['login', 'register', 'forgot-password', 'reset-password'];
  if (pathnames.some(path => excludedPaths.includes(path))) {
    return null;
  }

  return (
    <Box sx={{ py: 2 }}>
      <MuiBreadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        <Link
          component={RouterLink}
          to="/"
          color="inherit"
          sx={{
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline'
            }
          }}
        >
          {t('breadcrumbs.home')}
        </Link>
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const label = t(`breadcrumbs.${value}`) || value;

          return last ? (
            <Typography
              color="text.primary"
              key={to}
              sx={{ textTransform: 'capitalize' }}
            >
              {label}
            </Typography>
          ) : (
            <Link
              component={RouterLink}
              to={to}
              color="inherit"
              key={to}
              sx={{
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              {label}
            </Link>
          );
        })}
      </MuiBreadcrumbs>
    </Box>
  );
};

export default Breadcrumbs; 