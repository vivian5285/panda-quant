import { Theme } from '@mui/material/styles';

export const themeUtils = {
  createGradient: (color1: string, color2: string) => {
    return `linear-gradient(135deg, ${color1}, ${color2})`;
  },

  createTextGradient: (color1: string, color2: string) => {
    return {
      background: `linear-gradient(135deg, ${color1}, ${color2})`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    };
  },

  getThemeColor: (theme: Theme, color: string) => {
    return theme.palette[color as keyof typeof theme.palette]?.main || color;
  },

  textStyles: {
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
  },

  cardStyle: {
    borderRadius: 2,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
    },
  },

  buttonStyles: {
    contained: {
      borderRadius: 2,
      textTransform: 'none',
      fontWeight: 600,
      boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
      },
    },
    outlined: {
      borderRadius: 2,
      textTransform: 'none',
      fontWeight: 600,
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
      },
    },
    text: {
      borderRadius: 2,
      textTransform: 'none',
      fontWeight: 600,
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
      },
    },
  },
}; 