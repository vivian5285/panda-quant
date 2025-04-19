import React from 'react';
import { motion } from 'framer-motion';
import { Box, useTheme } from '@mui/material';
import { useBackgroundContext } from '../../contexts/BackgroundContext';
import { themeUtils } from '../../theme';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

const BackgroundAnimation: React.FC = () => {
  const { backgroundTheme } = useBackgroundContext();
  const theme = useTheme();
  
  const stars: Star[] = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2,
  }));

  const getBackgroundStyle = () => {
    switch (backgroundTheme) {
      case 'light':
        return 'linear-gradient(180deg, rgba(255, 255, 255, 0.8) 0%, rgba(240, 240, 240, 0.9) 100%)';
      case 'dark':
        return 'linear-gradient(180deg, rgba(17, 17, 17, 0.8) 0%, rgba(17, 17, 17, 0.9) 100%)';
      case 'gradient':
        return themeUtils.createRadialGradient(theme.palette.primary.main, 0.1);
      default:
        return 'linear-gradient(180deg, rgba(17, 17, 17, 0.8) 0%, rgba(17, 17, 17, 0.9) 100%)';
    }
  };

  const getStarColor = () => {
    return backgroundTheme === 'light' 
      ? theme.palette.text.secondary 
      : theme.palette.primary.main;
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      {/* 背景渐变 */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: getBackgroundStyle(),
          opacity: 0.5,
        }}
      />

      {/* 星光效果 */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          style={{
            position: 'absolute',
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            background: getStarColor(),
            borderRadius: '50%',
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* 熊猫主题动画 - 仅在渐变主题下显示 */}
      {backgroundTheme === 'gradient' && (
        <>
          <motion.div
            style={{
              position: 'absolute',
              top: '20%',
              right: '10%',
              width: '200px',
              height: '200px',
              background: themeUtils.createRadialGradient(theme.palette.primary.main, 0.1),
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          <motion.div
            style={{
              position: 'absolute',
              bottom: '20%',
              left: '10%',
              width: '150px',
              height: '150px',
              background: themeUtils.createRadialGradient(theme.palette.primary.main, 0.1),
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* 流动线条 */}
          <motion.div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '100%',
              height: '100%',
              background: `linear-gradient(45deg, transparent 45%, ${theme.palette.primary.main}1A 50%, transparent 55%)`,
              backgroundSize: '200% 200%',
            }}
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </>
      )}
    </Box>
  );
};

export default BackgroundAnimation; 