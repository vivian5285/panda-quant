import { createTheme } from '@mui/material/styles';
import type { TypographyOptions } from '@mui/material/styles/createTypography';

// 主题颜色
interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  card: string;
  border: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
}

// 扩展 Material-UI 的 Palette 类型
declare module '@mui/material/styles' {
  interface Palette {
    accent: Palette['primary'];
    border: string;
    card: string;
  }
  interface PaletteOptions {
    accent?: PaletteOptions['primary'];
    border?: string;
    card?: string;
  }
}

// 主题配置
const themeConfig = {
  light: {
    primary: {
      main: '#00FFB8', // 熊猫绿
      light: '#33FFC6',
      dark: '#00CC93',
    },
    secondary: {
      main: '#FFFFFF', // 纯白
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
    card: '#FFFFFF',
    border: 'rgba(0, 0, 0, 0.1)',
    accent: {
      main: '#00FFB8', // 使用熊猫绿作为强调色
      light: '#33FFC6',
      dark: '#00CC93',
    },
    success: {
      main: '#00FFB8', // 使用熊猫绿作为成功色
      light: '#33FFC6',
      dark: '#00CC93',
    },
    warning: {
      main: '#FFD600', // 保留警告色
      light: '#FFDE33',
      dark: '#CCAB00',
    },
    error: {
      main: '#FF1744', // 保留错误色
      light: '#FF4569',
      dark: '#CC1236',
    },
  },
  dark: {
    primary: {
      main: '#00FFB8', // 熊猫绿
      light: '#33FFC6',
      dark: '#00CC93',
    },
    secondary: {
      main: '#FFFFFF', // 纯白
      light: '#FFFFFF',
      dark: '#F5F5F5',
    },
    background: {
      default: '#000000', // 纯黑
      paper: '#121212',
    },
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
    card: '#121212',
    border: 'rgba(255, 255, 255, 0.1)',
    accent: {
      main: '#00FFB8', // 使用熊猫绿作为强调色
      light: '#33FFC6',
      dark: '#00CC93',
    },
    success: {
      main: '#00FFB8', // 使用熊猫绿作为成功色
      light: '#33FFC6',
      dark: '#00CC93',
    },
    warning: {
      main: '#FFD600', // 保留警告色
      light: '#FFDE33',
      dark: '#CCAB00',
    },
    error: {
      main: '#FF1744', // 保留错误色
      light: '#FF4569',
      dark: '#CC1236',
    },
  },
};

// 排版配置
const typography: TypographyOptions = {
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

// 主题工具函数
export const themeUtils = {
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
    },
  },
  animationConfig: {
    duration: {
      fast: 0.2,
      medium: 0.5,
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
  backgroundStyles: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
    card: (theme: any) => ({
      background: theme.palette.mode === 'light' 
        ? '#FFFFFF'
        : '#121212',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
      border: '1px solid rgba(0, 255, 184, 0.1)',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 12px 40px rgba(0, 255, 184, 0.15)',
        borderColor: 'rgba(0, 255, 184, 0.3)',
        bgcolor: 'rgba(0, 255, 184, 0.05)',
      },
    }),
  },
};

export const createCustomTheme = (mode: 'light' | 'dark') => {
  return createTheme({
    palette: {
      mode,
      ...themeConfig[mode],
    },
    typography,
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 600,
            padding: '8px 24px',
            transition: 'all 0.3s ease',
          },
          contained: {
            ...themeUtils.buttonStyles.contained,
            variants: [],
          },
          outlined: {
            ...themeUtils.buttonStyles.outlined,
            variants: [],
          },
          text: {
            ...themeUtils.buttonStyles.text,
            variants: [],
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            ...themeUtils.backgroundStyles.card({ palette: { mode } }),
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
  });
};

// 导出主题实例
export const lightTheme = createCustomTheme('light');
export const darkTheme = createCustomTheme('dark');

export type { ThemeColors }; 