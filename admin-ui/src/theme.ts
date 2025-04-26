import { createTheme } from '@mui/material/styles';
import type { TypographyOptions } from '@mui/material/styles/createTypography';

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

// 排版配置
const typography: TypographyOptions = {
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

export const theme = createTheme({
  palette: {
    mode: 'light',
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
  typography,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 16px',
          fontWeight: 600,
          fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#00FFB8',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#00FFB8',
            },
          },
          '& .MuiInputLabel-root': {
            fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 255, 184, 0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 255, 184, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 40px rgba(0, 255, 184, 0.15)',
            borderColor: 'rgba(0, 255, 184, 0.3)',
          },
        },
      },
    },
  },
});

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
}; 