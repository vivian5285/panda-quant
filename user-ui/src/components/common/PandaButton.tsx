import React from 'react';
import { Button, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { themeUtils } from '../../theme';

export interface PandaButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'text' | 'contained' | 'outlined';
  color?: 'primary' | 'secondary' | 'error' | 'success' | 'warning' | 'info';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  sx?: any;
  type?: 'button' | 'submit' | 'reset';
  href?: string;
  target?: string;
  animate?: boolean;
}

const PandaButton: React.FC<PandaButtonProps> = ({
  children,
  onClick,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  startIcon,
  endIcon,
  sx,
  type = 'button',
  href,
  target,
  animate = true,
}) => {
  const theme = useTheme();

  const button = (
    <Button
      variant={variant}
      color={color}
      size={size}
      disabled={disabled}
      fullWidth={fullWidth}
      startIcon={startIcon}
      endIcon={endIcon}
      onClick={onClick}
      type={type}
      href={href}
      target={target}
      sx={{
        borderRadius: theme.shape.borderRadius,
        textTransform: 'none',
        fontWeight: 600,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[4],
        },
        ...sx,
      }}
    >
      {children}
    </Button>
  );

  if (!animate) {
    return button;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {button}
    </motion.div>
  );
};

export default PandaButton; 