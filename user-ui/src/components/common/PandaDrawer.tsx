import React from 'react';
import {
  Drawer as MuiDrawer,
  Box,
  Typography,
  IconButton,
  useTheme,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import { themeUtils } from '../../theme';
import CloseIcon from '@mui/icons-material/Close';

interface PandaDrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  anchor?: 'left' | 'right' | 'top' | 'bottom';
  width?: number | string;
  height?: number | string;
  animate?: boolean;
  hideBackdrop?: boolean;
}

export const PandaDrawer: React.FC<PandaDrawerProps> = ({
  open,
  onClose,
  title,
  children,
  anchor = 'right',
  width = 240,
  height = '100%',
  animate = true,
  hideBackdrop = false,
}) => {
  const theme = useTheme();

  const getDrawerStyle = () => ({
    '& .MuiDrawer-paper': {
      width,
      height,
      background: theme.palette.background.paper,
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.shadows[4],
    },
  });

  const getAnimation = () => {
    if (!animate) return {};

    return {
      initial: { opacity: 0, x: anchor === 'right' ? 100 : -100 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: anchor === 'right' ? 100 : -100 },
    };
  };

  return (
    <MuiDrawer
      anchor={anchor}
      open={open}
      onClose={onClose}
      hideBackdrop={hideBackdrop}
      sx={getDrawerStyle()}
    >
      <motion.div {...getAnimation()}>
        <Box sx={{ p: 2 }}>
          {title && (
            <>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    fontWeight: 600,
                    background: themeUtils.createTextGradient(
                      theme.palette.primary.main,
                      theme.palette.primary.dark
                    ),
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {title}
                </Typography>
                <IconButton
                  aria-label="close"
                  onClick={onClose}
                  sx={{
                    color: theme.palette.grey[500],
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
              <Divider sx={{ mb: 2 }} />
            </>
          )}
          {children}
        </Box>
      </motion.div>
    </MuiDrawer>
  );
};

export default PandaDrawer; 