import { alpha, Theme } from '@mui/material/styles';

export const themeUtils = {
  createGradient: (color1: string, color2: string) => {
    return `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`;
  },
  createTextGradient: (color1: string, color2: string) => {
    return {
      background: `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    };
  },
  createRadialGradient: (color: string, opacity: number) => {
    return `radial-gradient(circle at center, ${alpha(color, opacity)} 0%, transparent 70%)`;
  },
  glassEffect: (theme: Theme, opacity = 0.8) => {
    return {
      background: alpha(theme.palette.background.paper, opacity),
      backdropFilter: 'blur(10px)',
      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`,
    };
  },
  animationConfig: {
    duration: {
      fast: 0.2,
      normal: 0.3,
      slow: 0.5,
    },
    delay: {
      small: 0.1,
      medium: 0.2,
      large: 0.3,
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
  },
  spacing: {
    grid: 8,
    section: 24,
    small: 16,
    medium: 24,
    large: 32,
  },
  backgroundStyles: {
    section: (theme: Theme) => ({
      background: alpha(theme.palette.background.paper, 0.8),
      backdropFilter: 'blur(10px)',
      borderRadius: '12px',
      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`,
    }),
  },
  buttonStyles: {
    contained: {
      borderRadius: '8px',
      textTransform: 'none',
      fontWeight: 600,
      padding: '8px 16px',
      boxShadow: 'none',
    },
    outlined: {
      borderRadius: '8px',
      textTransform: 'none',
      fontWeight: 600,
      padding: '8px 16px',
      border: '2px solid',
    },
    text: {
      borderRadius: '8px',
      textTransform: 'none',
      fontWeight: 600,
      padding: '8px 16px',
    },
  },
  textStyles: {
    h1: {
      fontSize: '3.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
  },
  cardStyle: {
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  },
}; 