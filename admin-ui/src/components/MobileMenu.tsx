import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Close as CloseIcon } from '@mui/icons-material';
import { StyledTypography } from './common/StyledComponents';
import { themeUtils } from '../theme';

interface MobileMenuProps {
  mobileOpen: boolean;
  onClose: () => void;
  menuItems: Array<{
    path: string;
    icon: React.ReactNode;
    text: string;
  }>;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ mobileOpen, onClose, menuItems }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Drawer
      variant="temporary"
      anchor="left"
      open={mobileOpen}
      onClose={onClose}
      ModalProps={{
        keepMounted: true,
      }}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 250 },
          background: themeUtils.gradients.primary,
          backdropFilter: 'blur(10px)',
          borderRight: `1px solid ${themeUtils.palette.primary.main}20`,
        },
      }}
    >
      <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
        <IconButton 
          onClick={onClose} 
          sx={{ 
            color: themeUtils.palette.primary.main,
            '&:hover': {
              backgroundColor: `${themeUtils.palette.primary.main}10`,
            },
          }}
        >
          <CloseIcon />
        </IconButton>
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                onClose();
              }}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: 1,
                mb: 1,
                py: { xs: 1, sm: 1.5 },
                '&.Mui-selected': {
                  backgroundColor: `${themeUtils.palette.primary.main}20`,
                  '&:hover': {
                    backgroundColor: `${themeUtils.palette.primary.main}30`,
                  },
                },
                '&:hover': {
                  backgroundColor: `${themeUtils.palette.primary.main}10`,
                },
              }}
            >
              <ListItemIcon sx={{ 
                color: themeUtils.palette.primary.main,
                minWidth: { xs: 40, sm: 48 },
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={
                  <StyledTypography
                    sx={{
                      color: location.pathname === item.path 
                        ? themeUtils.palette.primary.main 
                        : themeUtils.palette.text.primary,
                      fontWeight: location.pathname === item.path ? 600 : 400,
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                    }}
                  >
                    {t(item.text)}
                  </StyledTypography>
                }
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default MobileMenu; 