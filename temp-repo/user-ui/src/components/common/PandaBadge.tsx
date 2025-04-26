import React from 'react';
import { Badge, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

interface PandaBadgeProps {
  content?: string | number;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  variant?: 'standard' | 'dot';
  max?: number;
  showZero?: boolean;
  invisible?: boolean;
  anchorOrigin?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'right';
  };
  overlap?: 'circular' | 'rectangular';
  children?: React.ReactNode;
  animate?: boolean;
  glow?: boolean;
}

const PandaBadge: React.FC<PandaBadgeProps> = ({
  content,
  color = 'primary',
  variant = 'standard',
  max = 99,
  showZero = false,
  invisible = false,
  anchorOrigin = { vertical: 'top', horizontal: 'right' },
  overlap = 'rectangular',
  children,
  animate = false,
  glow = false,
}) => {
  const theme = useTheme();

  const getBadgeStyle = () => {
    const baseStyle = {
      '& .MuiBadge-badge': {
        backgroundColor: theme.palette[color].main,
        color: theme.palette[color].contrastText,
        transition: 'all 0.3s ease',
        '&.MuiBadge-dot': {
          width: 8,
          height: 8,
          borderRadius: '50%',
        },
        '&.MuiBadge-standard': {
          minWidth: 20,
          height: 20,
          borderRadius: 10,
          padding: '0 6px',
          fontSize: '0.75rem',
          fontWeight: 600,
        },
      },
    };

    if (glow) {
      return {
        ...baseStyle,
        '& .MuiBadge-badge': {
          ...baseStyle['& .MuiBadge-badge'],
          boxShadow: `0 0 10px ${theme.palette[color].main}40`,
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
      <Badge
        badgeContent={content}
        color={color}
        variant={variant}
        max={max}
        showZero={showZero}
        invisible={invisible}
        anchorOrigin={anchorOrigin}
        overlap={overlap}
        sx={getBadgeStyle()}
      >
        {children}
      </Badge>
    </motion.div>
  );
};

export default PandaBadge; 