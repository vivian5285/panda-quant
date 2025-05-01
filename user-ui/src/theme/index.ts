import { createTheme, ThemeOptions, Palette, PaletteColor } from '@mui/material/styles';
import type { TypographyOptions } from '@mui/material/styles/createTypography';
import { alpha } from '@mui/material/styles';

// 主题颜色
interface ThemeColors {
  primary: PaletteColor;
  secondary: PaletteColor;
  background: {
    default: string;
    paper: string;
  };
  text: {
    primary: string;
    secondary: string;
  };
  card: {
    main: string;
    border: string;
  };
  border: {
    main: string;
  };
  accent: PaletteColor;
  success: PaletteColor;
  warning: PaletteColor;
  error: PaletteColor;
}

// 扩展 Material-UI 的 Palette 类型
declare module '@mui/material/styles' {
  interface Palette {
    card: ThemeColors['card'];
    border: ThemeColors['border'];
    accent: PaletteColor;
  }
  interface PaletteOptions {
    card?: ThemeColors['card'];
    border?: ThemeColors['border'];
    accent?: PaletteColor;
  }
}

// 主题配置
const themeConfig = {
  light: {
    primary: {
      main: '#00FFB8',
      light: '#33FFC6',
      dark: '#00CC93',
      contrastText: '#000000',
    },
    secondary: {
      main: '#00CCFF',
      light: '#33D6FF',
      dark: '#00A3CC',
      contrastText: '#000000',
    },
    background: {
      default: '#FFFFFF',
      paper: '#F8F9FA',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
    card: {
      main: '#FFFFFF',
      border: 'rgba(0, 0, 0, 0.1)',
    },
    border: {
      main: 'rgba(0, 0, 0, 0.1)',
    },
    accent: {
      main: '#FF4D4D',
      light: '#FF7A7A',
      dark: '#CC3D3D',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#00CC93',
      light: '#33D6A8',
      dark: '#00A375',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#FFB800',
      light: '#FFC633',
      dark: '#CC9300',
      contrastText: '#000000',
    },
    error: {
      main: '#FF4D4D',
      light: '#FF7A7A',
      dark: '#CC3D3D',
      contrastText: '#FFFFFF',
    },
  },
  dark: {
    primary: {
      main: '#00FFB8',
      light: '#33FFC6',
      dark: '#00CC93',
      contrastText: '#000000',
    },
    secondary: {
      main: '#00CCFF',
      light: '#33D6FF',
      dark: '#00A3CC',
      contrastText: '#000000',
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0',
    },
    card: {
      main: '#1E1E1E',
      border: 'rgba(255, 255, 255, 0.1)',
    },
    border: {
      main: 'rgba(255, 255, 255, 0.1)',
    },
    accent: {
      main: '#FF4D4D',
      light: '#FF7A7A',
      dark: '#CC3D3D',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#00CC93',
      light: '#33D6A8',
      dark: '#00A375',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#FFB800',
      light: '#FFC633',
      dark: '#CC9300',
      contrastText: '#000000',
    },
    error: {
      main: '#FF4D4D',
      light: '#FF7A7A',
      dark: '#CC3D3D',
      contrastText: '#FFFFFF',
    },
  },
};

// 过渡配置
const transitions = {
  duration: {
    shortest: 150,
    shorter: 200,
    short: 250,
    standard: 300,
    complex: 375,
    enteringScreen: 225,
    leavingScreen: 195,
  },
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  },
};

// 排版配置
const typography: TypographyOptions = {
  fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
  h1: {
    fontSize: '2.5rem',
    fontWeight: 700,
    lineHeight: 1.2,
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 700,
    lineHeight: 1.2,
  },
  h3: {
    fontSize: '1.75rem',
    fontWeight: 600,
    lineHeight: 1.2,
  },
  h4: {
    fontSize: '1.5rem',
    fontWeight: 600,
    lineHeight: 1.2,
  },
  h5: {
    fontSize: '1.25rem',
    fontWeight: 600,
    lineHeight: 1.2,
  },
  h6: {
    fontSize: '1rem',
    fontWeight: 600,
    lineHeight: 1.2,
  },
  body1: {
    fontSize: '1rem',
    lineHeight: 1.5,
  },
  body2: {
    fontSize: '0.875rem',
    lineHeight: 1.5,
  },
  button: {
    textTransform: 'none',
    fontWeight: 600,
  },
};

export const createCustomTheme = (mode: 'light' | 'dark' = 'light') => {
  const colors = mode === 'light' ? themeConfig.light : themeConfig.dark;

  const themeOptions: ThemeOptions = {
    palette: {
      mode,
      primary: colors.primary,
      secondary: colors.secondary,
      background: colors.background,
      text: colors.text,
      card: colors.card,
      border: colors.border,
      accent: colors.accent,
      success: colors.success,
      warning: colors.warning,
      error: colors.error,
    },
    typography,
    transitions,
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          '*': {
            margin: 0,
            padding: 0,
            boxSizing: 'border-box',
          },
          html: {
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            height: '100%',
            width: '100%',
          },
          body: {
            height: '100%',
          },
          '#root': {
            height: '100%',
          },
          '::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '::-webkit-scrollbar-track': {
            background: colors.background.paper,
          },
          '::-webkit-scrollbar-thumb': {
            background: colors.border.main,
            borderRadius: '4px',
            '&:hover': {
              background: colors.text.secondary,
            },
          },
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
          variant: 'contained',
        },
        styleOverrides: {
          root: {
            borderRadius: '8px',
            padding: '8px 16px',
            fontSize: '1rem',
            fontWeight: 600,
            textTransform: 'none',
            transition: 'all 0.2s ease',
          },
          contained: {
            backgroundColor: colors.primary.main,
            color: colors.primary.contrastText,
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: colors.primary.dark,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            },
            '&:active': {
              backgroundColor: colors.primary.dark,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '16px',
            background: mode === 'light' 
              ? 'rgba(255, 255, 255, 0.8)'
              : 'rgba(30, 30, 30, 0.8)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${colors.border.main}`,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          h1: {
            background: `linear-gradient(45deg, ${colors.primary.main} 30%, ${colors.secondary.main} 90%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 700,
          },
          h2: {
            background: `linear-gradient(45deg, ${colors.primary.main} 30%, ${colors.secondary.main} 90%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 700,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              '&:hover': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: colors.primary.main,
                },
              },
              '&.Mui-focused': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: colors.primary.main,
                  borderWidth: '2px',
                },
              },
            },
          },
        },
      },
    },
  };

  return createTheme(themeOptions);
};

// 导出主题工具函数
export interface ThemeUtils {
  animationConfig: {
    duration: {
      short: number;
      medium: number;
      long: number;
      slow: number;
    };
    easing: {
      easeInOut: string;
      easeOut: string;
      easeIn: string;
      sharp: string;
    };
  };
  createGradient: (color1: string, color2: string) => string;
  createRadialGradient: (color: string, opacity: number) => string;
  createTextGradient: (color1: string, color2: string) => string;
  glassEffect: (opacity?: number) => {
    background: string;
    backdropFilter: string;
    border: string;
  };
  spacing: {
    grid: number;
  };
  textStyles: TypographyOptions;
  cardStyle: {
    borderRadius: number;
    boxShadow: string;
    padding: number;
  };
  buttonStyles: {
    borderRadius: number;
    textTransform: string;
    fontWeight: number;
  };
  backgroundStyles: {
    card: (theme: any) => {
      background: string;
      backdropFilter: string;
      border: string;
    };
    section: (theme: any) => {
      background: string;
      backdropFilter: string;
      border: string;
    };
  };
  gradients: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export const themeUtils: ThemeUtils = {
  animationConfig: {
    duration: {
      short: 200,
      medium: 400,
      long: 600,
      slow: 1000,
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
  },
  createGradient: (color1: string, color2: string) => {
    return `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`;
  },
  createRadialGradient: (color: string, opacity: number) => {
    return `radial-gradient(circle at center, ${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')} 0%, transparent 100%)`;
  },
  createTextGradient: (color1: string, color2: string) => {
    return `linear-gradient(45deg, ${color1}, ${color2})`;
  },
  glassEffect: (opacity = 0.1) => ({
    background: `rgba(255, 255, 255, ${opacity})`,
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  }),
  spacing: {
    grid: 8,
  },
  textStyles: typography,
  cardStyle: {
    borderRadius: 2,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    padding: 2,
  },
  buttonStyles: {
    borderRadius: 2,
    textTransform: 'none',
    fontWeight: 600,
  },
  backgroundStyles: {
    card: (theme) => ({
      background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.default, 0.9)} 100%)`,
      backdropFilter: 'blur(10px)',
      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    }),
    section: (theme) => ({
      background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.default, 0.9)} 100%)`,
      backdropFilter: 'blur(10px)',
      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    }),
  },
  gradients: {
    primary: `linear-gradient(135deg, ${themeConfig.light.primary.main} 0%, ${themeConfig.light.secondary.main} 100%)`,
    secondary: `linear-gradient(135deg, ${themeConfig.light.secondary.main} 0%, ${themeConfig.light.primary.main} 100%)`,
    accent: `linear-gradient(135deg, ${themeConfig.light.accent.main} 0%, ${themeConfig.light.accent.dark} 100%)`,
  },
};

// 导出主题实例
export const lightTheme = createCustomTheme('light');
export const darkTheme = createCustomTheme('dark');

export type { ThemeColors }; 