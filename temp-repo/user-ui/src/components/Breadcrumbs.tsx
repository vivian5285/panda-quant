import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Breadcrumbs as MuiBreadcrumbs, Typography, Link, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';

interface BreadcrumbItem {
  path: string;
  label: string;
  icon?: React.ReactNode;
}

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathnames = location.pathname.split('/').filter((x) => x);
    const breadcrumbs: BreadcrumbItem[] = [
      {
        path: '/',
        label: t('home.title'),
        icon: <HomeIcon fontSize="small" sx={{ mr: 0.5 }} />,
      },
    ];

    let currentPath = '';
    pathnames.forEach((value) => {
      currentPath += `/${value}`;
      const translationKey = value.replace(/-/g, '_');
      breadcrumbs.push({
        path: currentPath,
        label: t(`${translationKey}.title`, { defaultValue: value }),
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length === 1) {
    return null;
  }

  return (
    <Box
      sx={{
        p: 2,
        bgcolor: 'background.paper',
        borderRadius: 1,
        boxShadow: 1,
        '& .MuiBreadcrumbs-separator': {
          mx: 1,
        },
      }}
    >
      <MuiBreadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return isLast ? (
            <Typography
              key={item.path}
              color="text.primary"
              sx={{
                display: 'flex',
                alignItems: 'center',
                fontWeight: 500,
              }}
            >
              {item.icon}
              {item.label}
            </Typography>
          ) : (
            <Link
              key={item.path}
              component={RouterLink}
              to={item.path}
              color="inherit"
              sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </MuiBreadcrumbs>
    </Box>
  );
};

export default Breadcrumbs; 