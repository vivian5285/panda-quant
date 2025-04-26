import React from 'react';
import {
  Menu,
  MenuItem,
  useTheme,
  Divider,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { motion } from 'framer-motion';
import { themeUtils } from '../../theme';

interface MenuItemProps {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  divider?: boolean;
}

interface PandaMenuProps {
  open: boolean;
  onClose: () => void;
  anchorEl: HTMLElement | null;
  items: MenuItemProps[];
  anchorOrigin?: {
    vertical: 'top' | 'center' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
  transformOrigin?: {
    vertical: 'top' | 'center' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
  animate?: boolean;
  glow?: boolean;
}

const PandaMenu: React.FC<PandaMenuProps> = ({
  open,
  onClose,
  anchorEl,
  items,
  anchorOrigin = { vertical: 'bottom', horizontal: 'left' },
  transformOrigin = { vertical: 'top', horizontal: 'left' },
  animate = false,
  glow = false,
}) => {
  const theme = useTheme();

  const getMenuStyle = () => {
    const baseStyle = {
      '& .MuiPaper-root': {
        background: themeUtils.createGradient(
          theme.palette.background.paper,
          theme.palette.background.default
        ),
        boxShadow: theme.shadows[24],
        borderRadius: theme.shape.borderRadius * 2,
        minWidth: 200,
        transition: 'all 0.3s ease',
        '& .MuiMenuItem-root': {
          padding: theme.spacing(1.5, 2),
          transition: 'all 0.2s ease',
          '&:hover': {
            background: themeUtils.createGradient(
              theme.palette.primary.main,
              theme.palette.primary.dark
            ),
            '& .MuiListItemIcon-root': {
              color: theme.palette.primary.contrastText,
            },
            '& .MuiListItemText-primary': {
              color: theme.palette.primary.contrastText,
            },
          },
        },
        '& .MuiListItemIcon-root': {
          minWidth: 40,
          color: theme.palette.text.secondary,
        },
        '& .MuiListItemText-primary': {
          color: theme.palette.text.primary,
        },
      },
    };

    if (glow) {
      return {
        ...baseStyle,
        '& .MuiPaper-root': {
          ...baseStyle['& .MuiPaper-root'],
          boxShadow: `0 0 30px ${theme.palette.primary.main}20`,
        },
      };
    }

    return baseStyle;
  };

  const getAnimation = () => {
    if (!animate) return {};
    return {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.8 },
      transition: { duration: 0.3 },
    };
  };

  return (
    <Menu
      open={open}
      onClose={onClose}
      anchorEl={anchorEl}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
      sx={getMenuStyle()}
    >
      <motion.div {...getAnimation()}>
        {items.map((item, index) => (
          <>
            <MenuItem
              key={index}
              onClick={() => {
                item.onClick?.();
                onClose();
              }}
              disabled={item.disabled}
            >
              {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
              <ListItemText primary={item.label} />
            </MenuItem>
            {item.divider && <Divider />}
          </>
        ))}
      </motion.div>
    </Menu>
  );
};

export default PandaMenu; 