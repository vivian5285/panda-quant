import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Close as CloseIcon } from '@mui/icons-material';

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
    >
      <div style={{ width: 250 }}>
        <IconButton onClick={onClose} style={{ margin: '8px' }}>
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
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={t(item.text)} />
            </ListItem>
          ))}
        </List>
      </div>
    </Drawer>
  );
};

export default MobileMenu; 