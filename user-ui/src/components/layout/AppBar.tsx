import React from 'react';
import { 
  AppBar as MuiAppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Box,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Menu,
  MenuItem,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SettingsIcon from '@mui/icons-material/Settings';
import LanguageIcon from '@mui/icons-material/Language';
import { useAuth } from '../../contexts/AuthContext';
import { themeUtils } from '../../theme';

interface AppBarProps {
  onThemeToggle: () => void;
  onLanguageChange: (lang: string) => void;
}

const AppBar: React.FC<AppBarProps> = ({ onThemeToggle, onLanguageChange }) => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [languageAnchor, setLanguageAnchor] = React.useState<null | HTMLElement>(null);

  const languages = [
    { code: 'zh', name: '中文' },
    { code: 'en', name: 'English' },
    { code: 'ja', name: '日本語' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLanguageClick = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageAnchor(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setLanguageAnchor(null);
  };

  const handleLanguageChange = async (languageCode: string) => {
    await i18n.changeLanguage(languageCode);
    onLanguageChange(languageCode);
    handleLanguageClose();
  };

  const drawer = (
    <Box>
      <List>
        <ListItem button onClick={() => navigate('/dashboard')}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary={t('nav.dashboard')} />
        </ListItem>
        <ListItem button onClick={() => navigate('/wallet')}>
          <ListItemIcon>
            <AccountBalanceIcon />
          </ListItemIcon>
          <ListItemText primary={t('nav.wallet')} />
        </ListItem>
        <ListItem button onClick={() => navigate('/settings')}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary={t('nav.settings')} />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem>
          <ListItemIcon>
            <LanguageIcon />
          </ListItemIcon>
          <ListItemText primary={t('nav.language')} />
        </ListItem>
        {languages.map((lang) => (
          <ListItem
            key={lang.code}
            button
            onClick={() => handleLanguageChange(lang.code)}
            selected={i18n.language === lang.code}
          >
            <ListItemText primary={lang.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <MuiAppBar
        position="fixed"
        sx={{
          background: theme.palette.mode === 'dark'
            ? 'rgba(17, 17, 17, 0.8)'
            : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${
            theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(0, 0, 0, 0.1)'
          }`,
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              background: themeUtils.createGradient(
                theme.palette.primary.main,
                theme.palette.secondary.main
              ),
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
            }}
          >
            {t('app.name')}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              onClick={handleLanguageClick}
              sx={{
                color: theme.palette.mode === 'dark' ? 'white' : 'text.primary',
                '&:hover': {
                  color: theme.palette.primary.main,
                },
              }}
            >
              <LanguageIcon />
            </IconButton>

            <Menu
              anchorEl={languageAnchor}
              open={Boolean(languageAnchor)}
              onClose={handleLanguageClose}
              PaperProps={{
                sx: {
                  background: theme.palette.mode === 'dark'
                    ? 'rgba(17, 17, 17, 0.95)'
                    : 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${
                    theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(0, 0, 0, 0.1)'
                  }`,
                },
              }}
            >
              {languages.map((lang) => (
                <MenuItem
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  selected={i18n.language === lang.code}
                  sx={{
                    '&:hover': {
                      background: `${theme.palette.primary.main}10`,
                    },
                    '&.Mui-selected': {
                      background: `${theme.palette.primary.main}20`,
                      '&:hover': {
                        background: `${theme.palette.primary.main}30`,
                      },
                    },
                  }}
                >
                  {lang.name}
                </MenuItem>
              ))}
            </Menu>

            <IconButton
              onClick={onThemeToggle}
              sx={{
                color: theme.palette.mode === 'dark' ? 'white' : 'text.primary',
                '&:hover': {
                  color: theme.palette.primary.main,
                },
              }}
            >
              {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>

            {!isAuthenticated ? (
              <>
                <Button
                  color="inherit"
                  onClick={() => navigate('/login')}
                  sx={{
                    '&:hover': {
                      color: theme.palette.primary.main,
                    },
                  }}
                >
                  {t('auth.login')}
                </Button>
                <Button
                  color="inherit"
                  onClick={() => navigate('/register')}
                  sx={{
                    '&:hover': {
                      color: theme.palette.primary.main,
                    },
                  }}
                >
                  {t('auth.register')}
                </Button>
              </>
            ) : (
              <Button
                color="inherit"
                onClick={logout}
                sx={{
                  '&:hover': {
                    color: theme.palette.primary.main,
                  },
                }}
              >
                {t('auth.logout')}
              </Button>
            )}
          </Box>
        </Toolbar>
      </MuiAppBar>

      {isMobile && (
        <Drawer
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: 240,
              background: theme.palette.mode === 'dark'
                ? 'rgba(17, 17, 17, 0.95)'
                : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRight: `1px solid ${
                theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(0, 0, 0, 0.1)'
              }`,
            },
          }}
        >
          {drawer}
        </Drawer>
      )}
    </>
  );
};

export default AppBar; 