import React from 'react';
import {
  Popover,
  Box,
  Typography,
  IconButton,
  useTheme,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import { themeUtils } from '../../theme';
import CloseIcon from '@mui/icons-material/Close';

interface PandaPopoverProps {
  open: boolean;
  onClose: () => void;
  anchorEl: HTMLElement | null;
  title?: string;
  children: React.ReactNode;
  anchorOrigin?: {
    vertical: 'top' | 'center' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
  transformOrigin?: {
    vertical: 'top' | 'center' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
  maxWidth?: number | string;
  minWidth?: number | string;
  animate?: boolean;
  glow?: boolean;
}

const PandaPopover: React.FC<PandaPopoverProps> = ({
  open,
  onClose,
  anchorEl,
  title,
  children,
  anchorOrigin = { vertical: 'bottom', horizontal: 'left' },
  transformOrigin = { vertical: 'top', horizontal: 'left' },
  maxWidth = 360,
  minWidth = 200,
  animate = false,
  glow = false,
}) => {
  const theme = useTheme();

  const getPopoverStyle = () => {
    const baseStyle = {
      '& .MuiPopover-paper': {
        background: themeUtils.createGradient(
          theme.palette.background.paper,
          theme.palette.background.default
        ),
        boxShadow: theme.shadows[24],
        borderRadius: theme.shape.borderRadius * 2,
        maxWidth: maxWidth,
        minWidth: minWidth,
        transition: 'all 0.3s ease',
      },
    };

    if (glow) {
      return {
        ...baseStyle,
        '& .MuiPopover-paper': {
          ...baseStyle['& .MuiPopover-paper'],
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
    <Popover
      open={open}
      onClose={onClose}
      anchorEl={anchorEl}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
      sx={getPopoverStyle()}
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
    </Popover>
  );
};

export default PandaPopover; 