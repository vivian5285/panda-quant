import React from 'react';
import { Box, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { themeUtils } from '../../theme';

interface PandaAvatarProps {
  src: string;
  size?: number;
  expression?: 'happy' | 'neutral' | 'sleepy' | 'excited';
  animate?: boolean;
  glow?: boolean;
}

const PandaAvatar: React.FC<PandaAvatarProps> = ({
  src,
  size = 100,
  expression = 'neutral',
  animate = false,
  glow = false,
}) => {
  const theme = useTheme();

  const getExpressionStyle = () => {
    switch (expression) {
      case 'happy':
        return {
          transform: 'scale(1.1)',
          filter: 'brightness(1.1)',
        };
      case 'excited':
        return {
          transform: 'scale(1.2)',
          filter: 'brightness(1.2)',
        };
      case 'sleepy':
        return {
          transform: 'scale(0.9)',
          filter: 'brightness(0.9)',
        };
      default:
        return {};
    }
  };

  const getAnimation = () => {
    if (!animate) return {};
    return {
      animate: {
        y: [0, -10, 0],
        scale: [1, 1.05, 1],
      },
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    };
  };

  return (
    <motion.div
      style={{
        position: 'relative',
        width: size,
        height: size,
      }}
      {...getAnimation()}
    >
      <Box
        component="img"
        src={src}
        alt="Panda Avatar"
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          filter: glow
            ? `drop-shadow(0 0 10px ${theme.palette.primary.main}40)`
            : 'none',
          ...getExpressionStyle(),
        }}
      />
      {glow && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: themeUtils.createRadialGradient(
              theme.palette.primary.main,
              0.2
            ),
            opacity: 0.5,
            zIndex: -1,
            animation: 'pulse 2s infinite',
          }}
        />
      )}
    </motion.div>
  );
};

export default PandaAvatar; 