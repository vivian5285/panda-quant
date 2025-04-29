import { createTheme, ThemeOptions, PaletteOptions, TypographyVariantsOptions } from '@mui/material/styles';
import React from 'react';

// 扩展 Material-UI 的 Palette 类型
declare module '@mui/material/styles' {
  interface Palette {
    accent: {
      main: string;
      light: string;
      dark: string;
    };
    border: {
      main: string;
      light: string;
      dark: string;
    };
    card: {
      main: string;
      light: string;
      dark: string;
    };
    gradient: {
      primary: string;
      secondary: string;
      success: string;
      warning: string;
      error: string;
      info: string;
    };
  }
  interface PaletteOptions {
    accent?: {
      main: string;
      light: string;
      dark: string;
    };
    border?: {
      main: string;
      light: string;
      dark: string;
    };
    card?: {
      main: string;
      light: string;
      dark: string;
    };
    gradient?: {
      primary: string;
      secondary: string;
      success: string;
      warning: string;
      error: string;
      info: string;
    };
  }
  interface TypographyVariants {
    h1: React.CSSProperties;
    h2: React.CSSProperties;
    h3: React.CSSProperties;
    h4: React.CSSProperties;
    h5: React.CSSProperties;
    h6: React.CSSProperties;
    body1: React.CSSProperties;
    body2: React.CSSProperties;
  }
  interface TypographyVariantsOptions {
    h1?: React.CSSProperties;
    h2?: React.CSSProperties;
    h3?: React.CSSProperties;
    h4?: React.CSSProperties;
    h5?: React.CSSProperties;
    h6?: React.CSSProperties;
    body1?: React.CSSProperties;
    body2?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    h1: true;
    h2: true;
    h3: true;
    h4: true;
    h5: true;
    h6: true;
    body1: true;
    body2: true;
  }
}

// 排版配置
const typography: TypographyVariantsOptions = {
  fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
  h1: {
    fontSize: '3.5rem',
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
  },
  h2: {
    fontSize: '2.5rem',
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '-0.01em',
  },
  h3: {
    fontSize: '2rem',
    fontWeight: 600,
    lineHeight: 1.4,
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
  subtitle1: {
    fontSize: '1.125rem',
    fontWeight: 500,
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
  button: {
    textTransform: 'none',
    fontWeight: 600,
  },
};

const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#00FFB8',
      light: '#33FFC6',
      dark: '#00CC93',
    },
    secondary: {
      main: '#FFFFFF',
      light: '#FFFFFF',
      dark: '#F5F5F5',
    },
    background: {
      default: '#FFFFFF',
      paper: '#F5F5F5',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
    card: {
      main: '#FFFFFF',
      light: '#F5F5F5',
      dark: '#EEEEEE',
    },
    border: {
      main: 'rgba(0, 0, 0, 0.1)',
      light: 'rgba(0, 0, 0, 0.05)',
      dark: 'rgba(0, 0, 0, 0.2)',
    },
    accent: {
      main: '#00FFB8',
      light: '#33FFC6',
      dark: '#00CC93',
    },
    success: {
      main: '#00FFB8',
      light: '#33FFC6',
      dark: '#00CC93',
    },
    warning: {
      main: '#FFD600',
      light: '#FFDE33',
      dark: '#CCAB00',
    },
    error: {
      main: '#FF1744',
      light: '#FF4569',
      dark: '#CC1236',
    },
    info: {
      main: '#2196F3',
      light: '#4DABF5',
      dark: '#0B79D0',
    },
    gradient: {
      primary: 'linear-gradient(135deg, #00FFB8 0%, #FFFFFF 100%)',
      secondary: 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 100%)',
      success: 'linear-gradient(135deg, #00FFB8 0%, #33FFC6 100%)',
      warning: 'linear-gradient(135deg, #FFD600 0%, #FFDE33 100%)',
      error: 'linear-gradient(135deg, #FF1744 0%, #FF4569 100%)',
      info: 'linear-gradient(135deg, #2196F3 0%, #4DABF5 100%)',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
};

const theme = createTheme(themeOptions);

export default theme;

export const themeUtils = {
  palette: {
    primary: {
      main: '#00FFB8',
      light: '#33FFC6',
      dark: '#00CC93',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },
  gradients: {
    primary: 'linear-gradient(135deg, #00FFB8 0%, #00CC93 100%)',
  },
} as const; 