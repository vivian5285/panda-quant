import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import { themeUtils } from '../../theme';
import CloseIcon from '@mui/icons-material/Close';

interface PandaDialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  fullWidth?: boolean;
  dividers?: boolean;
  animate?: boolean;
  glow?: boolean;
}

const PandaDialog: React.FC<PandaDialogProps> = ({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = 'sm',
  fullWidth = true,
  dividers = false,
  animate = false,
  glow = false,
}) => {
  const theme = useTheme();

  const getDialogStyle = () => {
    const baseStyle = {
      '& .MuiDialog-paper': {
        borderRadius: theme.shape.borderRadius * 2,
        background: themeUtils.createGradient(
          theme.palette.background.paper,
          theme.palette.background.default
        ),
        boxShadow: theme.shadows[24],
        transition: 'all 0.3s ease',
      },
      '& .MuiDialogTitle-root': {
        padding: theme.spacing(2),
        borderBottom: `1px solid ${theme.palette.divider}`,
        background: themeUtils.createTextGradient(
          theme.palette.primary.main,
          theme.palette.primary.dark
        ),
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      },
      '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
      },
      '& .MuiDialogActions-root': {
        padding: theme.spacing(2),
        borderTop: dividers ? `1px solid ${theme.palette.divider}` : 'none',
      },
    };

    if (glow) {
      return {
        ...baseStyle,
        '& .MuiDialog-paper': {
          ...baseStyle['& .MuiDialog-paper'],
          boxShadow: `0 0 30px ${theme.palette.primary.main}20`,
        },
      };
    }

    return baseStyle;
  };

  const getAnimation = () => {
    if (!animate) return {};
    return {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.9 },
      transition: { duration: 0.3 },
    };
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      sx={getDialogStyle()}
    >
      <motion.div {...getAnimation()}>
        {title && (
          <DialogTitle>
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
        )}
        <DialogContent dividers={dividers}>{children}</DialogContent>
        {actions && <DialogActions>{actions}</DialogActions>}
      </motion.div>
    </Dialog>
  );
};

export default PandaDialog; 