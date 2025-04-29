import { createTheme } from '@mui/material/styles';
import type { TypographyVariantsOptions } from '@mui/material/styles/createTypography';

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
    success: Palette['primary'];
    warning: Palette['primary'];
    error: Palette['primary'];
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
    success?: PaletteOptions['primary'];
    warning?: PaletteOptions['primary'];
    error?: PaletteOptions['primary'];
  }

  interface Theme {
    custom: {
      shadows: {
        card: string;
        cardHover: string;
        button: string;
        buttonHover: string;
      };
      gradients: {
        primary: string;
        secondary: string;
        success: string;
        warning: string;
        error: string;
        info: string;
      };
      animations: {
        duration: {
          short: number;
          medium: number;
          long: number;
        };
        easing: {
          easeInOut: string;
          easeOut: string;
          easeIn: string;
        };
      };
    };
  }

  interface ThemeOptions {
    custom?: {
      shadows?: {
        card?: string;
        cardHover?: string;
        button?: string;
        buttonHover?: string;
      };
      gradients?: {
        primary?: string;
        secondary?: string;
        success?: string;
        warning?: string;
        error?: string;
        info?: string;
      };
      animations?: {
        duration?: {
          short?: number;
          medium?: number;
          long?: number;
        };
        easing?: {
          easeInOut?: string;
          easeOut?: string;
          easeIn?: string;
        };
      };
    };
  }
}

// 主题配置
const themeConfig = {
  light: {
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
      light: '#FFFFFF',
      dark: '#F5F5F5',
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
      dark: '#1A78C2',
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
};

// 排版配置
const typography: TypographyVariantsOptions = {
  fontFamily: '"Poppins", "Alibaba PuHuiTi", "Roboto", "Helvetica", "Arial", sans-serif',
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

// 创建主题
export const theme = createTheme({
  palette: {
    primary: {
      main: '#00FFB8',
      light: '#33FFC6',
      dark: '#00CC93',
    },
    secondary: {
      main: '#6C63FF',
      light: '#8A84FF',
      dark: '#4A42CC',
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
    accent: {
      main: '#FF6B6B',
      light: '#FF8E8E',
      dark: '#CC5555',
    },
    border: {
      main: '#E0E0E0',
      light: '#F5F5F5',
      dark: '#BDBDBD',
    },
    card: {
      main: '#FFFFFF',
      light: '#FFFFFF',
      dark: '#F5F5F5',
    },
    gradient: {
      primary: 'linear-gradient(45deg, #00FFB8 30%, #6C63FF 90%)',
      secondary: 'linear-gradient(45deg, #6C63FF 30%, #FF6B6B 90%)',
      success: 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)',
      warning: 'linear-gradient(45deg, #FFC107 30%, #FFD54F 90%)',
      error: 'linear-gradient(45deg, #F44336 30%, #E57373 90%)',
      info: 'linear-gradient(45deg, #2196F3 30%, #64B5F6 90%)',
    },
    success: {
      main: '#4CAF50',
      light: '#81C784',
      dark: '#388E3C',
    },
    warning: {
      main: '#FFA726',
      light: '#FFB74D',
      dark: '#F57C00',
    },
    error: {
      main: '#F44336',
      light: '#E57373',
      dark: '#D32F2F',
    },
  },
  typography,
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 16px',
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
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
  custom: {
    shadows: {
      card: '0 4px 6px rgba(0, 0, 0, 0.1)',
      cardHover: '0 8px 12px rgba(0, 0, 0, 0.15)',
      button: '0 2px 4px rgba(0, 0, 0, 0.1)',
      buttonHover: '0 4px 8px rgba(0, 0, 0, 0.15)',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #00FFB8 0%, #FFFFFF 100%)',
      secondary: 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 100%)',
      success: 'linear-gradient(135deg, #00FFB8 0%, #33FFC6 100%)',
      warning: 'linear-gradient(135deg, #FFD600 0%, #FFDE33 100%)',
      error: 'linear-gradient(135deg, #FF1744 0%, #FF4569 100%)',
      info: 'linear-gradient(135deg, #2196F3 0%, #4DABF5 100%)',
    },
    animations: {
      duration: {
        short: 200,
        medium: 300,
        long: 500,
      },
      easing: {
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      },
    },
  },
});

// 主题工具函数
export const themeUtils = {
  palette: theme.palette,
  custom: theme.custom,
  createGradient: (color1: string, color2: string) => {
    return `linear-gradient(45deg, ${color1}, ${color2})`;
  },
  createTextGradient: (color1: string, color2: string) => ({
    background: `linear-gradient(45deg, ${color1}, ${color2})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  }),
  createRadialGradient: (color: string, opacity: number) => {
    return `radial-gradient(circle at center, ${color}${Math.floor(opacity * 255).toString(16)}, transparent)`;
  },
  glassEffect: (opacity: number = 0.1) => ({
    background: `rgba(255, 255, 255, ${opacity})`,
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  }),
  spacing: (multiplier: number) => `${multiplier * 8}px`,
  animationConfig: {
    duration: {
      short: 0.2,
      medium: 0.3,
      long: 0.5,
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
  },
  gradients: {
    primary: 'linear-gradient(45deg, #00FFB8 0%, #6C63FF 100%)',
    secondary: 'linear-gradient(45deg, #6C63FF 0%, #00FFB8 100%)',
  },
};

export default theme; 