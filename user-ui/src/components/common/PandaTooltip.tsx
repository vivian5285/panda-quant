import React from 'react';
import { Tooltip, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { themeUtils } from '../../theme';

interface PandaTooltipProps {
  title: string;
  children: React.ReactElement;
  placement?:
    | 'bottom-end'
    | 'bottom-start'
    | 'bottom'
    | 'left-end'
    | 'left-start'
    | 'left'
    | 'right-end'
    | 'right-start'
    | 'right'
    | 'top-end'
    | 'top-start'
    | 'top';
  arrow?: boolean;
  enterDelay?: number;
  leaveDelay?: number;
  animate?: boolean;
  glow?: boolean;
}

const PandaTooltip: React.FC<PandaTooltipProps> = ({
  title,
  children,
  placement = 'bottom',
  arrow = true,
  enterDelay = 200,
  leaveDelay = 200,
  animate = false,
  glow = false,
}) => {
  const theme = useTheme();

  const getTooltipStyle = () => {
    const baseStyle = {
      '& .MuiTooltip-tooltip': {
        background: themeUtils.createGradient(
          theme.palette.background.paper,
          theme.palette.background.default
        ),
        color: theme.palette.text.primary,
        fontSize: theme.typography.body2.fontSize,
        padding: theme.spacing(1, 1.5),
        borderRadius: theme.shape.borderRadius,
        boxShadow: theme.shadows[4],
        transition: 'all 0.3s ease',
      },
      '& .MuiTooltip-arrow': {
        color: theme.palette.background.paper,
      },
    };

    if (glow) {
      return {
        ...baseStyle,
        '& .MuiTooltip-tooltip': {
          ...baseStyle['& .MuiTooltip-tooltip'],
          boxShadow: `0 0 20px ${theme.palette.primary.main}20`,
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
      transition: { duration: 0.2 },
    };
  };

  return (
    <Tooltip
      title={
        <motion.div {...getAnimation()}>
          {title}
        </motion.div>
      }
      placement={placement}
      arrow={arrow}
      enterDelay={enterDelay}
      leaveDelay={leaveDelay}
      sx={getTooltipStyle()}
    >
      {children}
    </Tooltip>
  );
};

export default PandaTooltip; 