import React from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useBackgroundContext } from '../../contexts/BackgroundContext';

const GlobalBackground: React.FC = () => {
  const { backgroundTheme } = useBackgroundContext();
  const theme = useTheme();

  const getBackgroundStyle = () => {
    if (backgroundTheme === 'gradient') {
      return `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`;
    }
    return theme.palette.background.default;
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        background: getBackgroundStyle(),
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at center, ${theme.palette.primary.main}${Math.round(0.1 * 255).toString(16)} 0%, transparent 70%)`,
          opacity: theme.palette.mode === 'dark' ? 0.2 : 0.1,
        },
      }}
    />
  );
};

export default GlobalBackground; 