import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const { logout } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {t('appName')}
        </Typography>
        <Button color="inherit" onClick={logout}>
          {t('logout')}
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 