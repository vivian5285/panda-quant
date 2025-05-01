import { Theme, createTheme, ThemeOptions } from '@mui/material/styles';
import { PaletteColor } from '@mui/material/styles/createPalette';
import { themeUtils } from './theme/index';

export { themeUtils };

const buttonStyles: ThemeOptions['components'] = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        textTransform: 'none',
        fontWeight: 600,
        padding: '8px 24px',
      },
      contained: {
        boxShadow: 'none',
        '&:hover': {
          boxShadow: 'none',
        },
      },
      outlined: {
        borderWidth: 2,
      },
      text: {
        padding: '8px 16px',
      },
    },
  },
};

export const createCustomTheme = (mode: 'light' | 'dark' = 'light') => {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#00FFB8',
        light: '#33FFC6',
        dark: '#00B282',
        contrastText: '#000000',
      },
      secondary: {
        main: '#FF00B8',
        light: '#FF33C6',
        dark: '#B20082',
        contrastText: '#FFFFFF',
      },
      background: {
        default: mode === 'light' ? '#F5F5F5' : '#121212',
        paper: mode === 'light' ? '#FFFFFF' : '#1E1E1E',
      },
    },
    typography: {
      fontFamily: 'Roboto, sans-serif',
      h1: themeUtils.textStyles.h1,
      h2: themeUtils.textStyles.h2,
      h3: themeUtils.textStyles.h3,
      h4: themeUtils.textStyles.h4,
      h5: themeUtils.textStyles.h5,
      h6: themeUtils.textStyles.h6,
      body1: themeUtils.textStyles.body1,
      body2: themeUtils.textStyles.body2,
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: themeUtils.cardStyle,
        },
      },
      MuiButton: {
        styleOverrides: {
          ...buttonStyles.MuiButton?.styleOverrides,
        },
      },
    },
  });
}; 