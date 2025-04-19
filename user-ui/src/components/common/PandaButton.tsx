import React from 'react';
import { Button, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { themeUtils } from '../../theme';

interface PandaButtonProps {
  variant?: 'contained' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  animate?: boolean;
  glow?: boolean;
  sx?: any;
  loading?: boolean;
  type?: string;
}

const PandaButton: React.FC<PandaButtonProps> = ({
  variant = 'contained',
  size = 'medium',
  color = 'primary',
  startIcon,
  endIcon,
  disabled = false,
  fullWidth = false,
  onClick,
  children,
  animate = false,
  glow = false,
  sx,
  loading = false,
  type,
}) => {
  const theme = useTheme();

  const getButtonStyle = () => {
    const baseStyle = {
      borderRadius: theme.shape.borderRadius,
      textTransform: 'none',
      fontWeight: 600,
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: themeUtils.createGradient(
          theme.palette[color].main,
          theme.palette[color].dark
        ),
        opacity: 0,
        transition: 'opacity 0.3s ease',
      },
      '&:hover::before': {
        opacity: 0.1,
      },
    };

    if (glow) {
      return {
        ...baseStyle,
        boxShadow: `0 0 20px ${theme.palette[color].main}40`,
        '&:hover': {
          boxShadow: `0 0 30px ${theme.palette[color].main}60`,
        },
      };
    }

    return baseStyle;
  };

  const getAnimation = () => {
    if (!animate) return {};
    return {
      whileHover: {
        scale: 1.05,
        transition: { duration: 0.2 },
      },
      whileTap: {
        scale: 0.95,
        transition: { duration: 0.1 },
      },
    };
  };

  return (
    <motion.div {...getAnimation()}>
      <Button
        variant={variant}
        size={size}
        color={color}
        startIcon={startIcon}
        endIcon={endIcon}
        disabled={disabled}
        fullWidth={fullWidth}
        onClick={onClick}
        sx={getButtonStyle()}
      >
        {children}
      </Button>
    </motion.div>
  );
};

export default PandaButton; 