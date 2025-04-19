import { Theme } from '@mui/material/styles';
import { ThemeUtils } from '../types/theme';

export const themeUtils: ThemeUtils = {
  createGradient: (color1: string, color2: string): string => {
    return `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`;
  },

  createTextGradient: (color1: string, color2: string) => ({
    background: `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  }),

  createRadialGradient: (color: string, opacity: number) => ({
    background: `radial-gradient(circle at center, ${color}${Math.round(opacity * 255).toString(16)} 0%, transparent 70%)`,
  }),

  glassEffect: (opacity = 0.1) => ({
    background: `rgba(255, 255, 255, ${opacity})`,
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  }),

  containerStyle: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0 20px',
  },

  sectionStyle: {
    position: 'relative',
    padding: '80px 0',
    overflow: 'hidden',
  },

  feedbackEffect: {
    transform: 'scale(0.95)',
    transition: 'all 0.2s ease',
  },

  animationConfig: {
    duration: {
      fast: 0.2,
      normal: 0.5,
      slow: 0.8,
    },
    delay: {
      small: 0.1,
      medium: 0.2,
      large: 0.3,
    },
    easing: {
      easeInOut: [0.4, 0, 0.2, 1],
      easeOut: [0, 0, 0.2, 1],
      easeIn: [0.4, 0, 1, 1],
    },
  },

  spacing: {
    section: {
      xs: '40px 0',
      md: '80px 0',
      lg: '120px 0',
    },
    container: {
      xs: '0 16px',
      md: '0 24px',
      lg: '0 32px',
    },
    grid: {
      xs: 2,
      md: 4,
      lg: 6,
    },
  },

  breakpoints: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
  },

  typography: {
    h1: {
      fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem', lg: '4rem' },
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem', lg: '3rem' },
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem', lg: '2.5rem' },
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
      lineHeight: 1.6,
    },
    body2: {
      fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
      lineHeight: 1.6,
    },
  },

  backgroundStyles: {
    section: (theme: Theme) => ({
      background: theme.palette.mode === 'dark'
        ? 'linear-gradient(180deg, rgba(17, 17, 17, 0.8) 0%, rgba(17, 17, 17, 0.9) 100%)'
        : 'linear-gradient(180deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.9) 100%)',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `radial-gradient(circle at center, ${theme.palette.primary.main}${Math.round(0.1 * 255).toString(16)} 0%, transparent 70%)`,
        zIndex: 1,
      },
    }),
    card: (theme: Theme) => ({
      background: theme.palette.mode === 'dark'
        ? 'rgba(0, 255, 184, 0.1)'
        : 'rgba(0, 107, 79, 0.1)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      border: `1px solid ${theme.palette.mode === 'dark'
        ? 'rgba(0, 255, 184, 0.2)'
        : 'rgba(0, 107, 79, 0.2)'}`,
    }),
  },

  buttonStyles: (theme: Theme) => ({
    contained: {
      boxShadow: `0 0 20px ${theme.palette.primary.main}33`,
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: `0 8px 24px ${theme.palette.primary.main}4D`,
      },
      transition: theme.transitions.create(['all'], {
        duration: theme.transitions.duration.standard,
      }),
      borderRadius: theme.shape.borderRadius,
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.5px',
      px: 4,
      py: 1.5,
      fontSize: { xs: '1rem', md: '1.1rem' },
    },
  }),

  pandaEffect: {
    glow: (color: string) => ({
      boxShadow: `0 0 20px ${color}33`,
    }),
    hover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 24px rgba(0, 255, 184, 0.3)',
    },
  },
}; 