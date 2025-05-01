import React from 'react';
import { Chip, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

interface PandaChipProps {
  label: string;
  color?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'default';
  variant?: 'filled' | 'outlined';
  size?: 'small' | 'medium';
  icon?: React.ReactElement;
  onDelete?: () => void;
  onClick?: () => void;
  disabled?: boolean;
  animate?: boolean;
  glow?: boolean;
}

export const PandaChip: React.FC<PandaChipProps> = ({
  label,
  color = 'primary',
  variant = 'filled',
  size = 'medium',
  icon,
  onDelete,
  onClick,
  disabled = false,
  animate = true,
  glow = false,
}) => {
  const theme = useTheme();

  const getChipStyle = () => ({
    borderRadius: theme.shape.borderRadius,
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: glow ? theme.shadows[8] : theme.shadows[4],
    },
    ...(variant === 'outlined' && {
      borderColor: theme.palette[color].main,
      '&:hover': {
        background: theme.palette[color].light,
      },
    }),
  });

  const getAnimation = () => {
    if (!animate) return {};

    return {
      whileHover: { scale: 1.05 },
      whileTap: { scale: 0.95 },
    };
  };

  return (
    <motion.div {...getAnimation()}>
      <Chip
        label={label}
        color={color}
        variant={variant}
        size={size}
        icon={icon}
        onDelete={onDelete}
        onClick={onClick}
        disabled={disabled}
        sx={getChipStyle()}
      />
    </motion.div>
  );
}; 