import '@mui/material/styles';
import { Theme as MuiTheme, ThemeOptions as MuiThemeOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface TypeBackground {
    gradient: string;
  }

  interface Palette {
    card: {
      background: string;
      shadow: string;
    };
    button: {
      primary: string;
      hover: string;
    };
  }

  interface PaletteOptions {
    card?: {
      background?: string;
      shadow?: string;
    };
    button?: {
      primary?: string;
      hover?: string;
    };
  }

  interface Theme extends MuiTheme {
    customColors: {
      dark: {
        background: string;
        text: string;
        primary: {
          start: string;
          end: string;
        };
        secondary: string;
        accent: string;
      };
      light: {
        background: string;
        text: string;
        primary: {
          start: string;
          end: string;
        };
        secondary: string;
        accent: string;
      };
    };
    customGradients: {
      primary: string;
      secondary: string;
    };
    customShadows: {
      card: string;
      button: string;
    };
    customTransitions: {
      quick: string;
      normal: string;
      slow: string;
    };
  }

  interface ThemeOptions extends MuiThemeOptions {
    customColors?: {
      dark?: {
        background?: string;
        text?: string;
        primary?: {
          start?: string;
          end?: string;
        };
        secondary?: string;
        accent?: string;
      };
      light?: {
        background?: string;
        text?: string;
        primary?: {
          start?: string;
          end?: string;
        };
        secondary?: string;
        accent?: string;
      };
    };
    customGradients?: {
      primary?: string;
      secondary?: string;
    };
    customShadows?: {
      card?: string;
      button?: string;
    };
    customTransitions?: {
      quick?: string;
      normal?: string;
      slow?: string;
    };
  }
}

import { Theme } from '@mui/material/styles';

export interface ThemeUtils {
  createGradient: (color1: string, color2: string) => string;
  createTextGradient: (color1: string, color2: string) => {
    background: string;
    WebkitBackgroundClip: string;
    WebkitTextFillColor: string;
    backgroundClip: string;
  };
  createRadialGradient: (color: string, opacity: number) => {
    background: string;
  };
  glassEffect: (opacity?: number) => {
    background: string;
    backdropFilter: string;
    WebkitBackdropFilter: string;
    border: string;
  };
  containerStyle: {
    maxWidth: number;
    margin: string;
    padding: string;
  };
  sectionStyle: {
    position: string;
    padding: string;
    overflow: string;
  };
  feedbackEffect: {
    transform: string;
    transition: string;
  };
  animationConfig: {
    duration: {
      fast: number;
      medium: number;
      slow: number;
    };
    delay: {
      small: number;
      medium: number;
      large: number;
    };
    easing: {
      easeInOut: number[];
      easeOut: number[];
      easeIn: number[];
    };
  };
  spacing: {
    section: {
      xs: string;
      md: string;
      lg: string;
    };
    container: {
      xs: string;
      md: string;
      lg: string;
    };
    grid: {
      xs: number;
      md: number;
      lg: number;
    };
  };
  breakpoints: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  typography: {
    h1: {
      fontSize: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
      };
      fontWeight: number;
      lineHeight: number;
    };
    h2: {
      fontSize: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
      };
      fontWeight: number;
      lineHeight: number;
    };
    h3: {
      fontSize: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
      };
      fontWeight: number;
      lineHeight: number;
    };
    body1: {
      fontSize: {
        xs: string;
        sm: string;
        md: string;
      };
      lineHeight: number;
    };
    body2: {
      fontSize: {
        xs: string;
        sm: string;
        md: string;
      };
      lineHeight: number;
    };
  };
  backgroundStyles: {
    section: (theme: Theme) => {
      background: string;
      '&::before': {
        content: string;
        position: string;
        top: number;
        left: number;
        right: number;
        bottom: number;
        background: string;
        zIndex: number;
      };
    };
    card: (theme: Theme) => {
      background: string;
      backdropFilter: string;
      WebkitBackdropFilter: string;
      border: string;
    };
  };
  buttonStyles: (theme: Theme) => {
    contained: {
      boxShadow: string;
      '&:hover': {
        transform: string;
        boxShadow: string;
      };
      transition: string;
      borderRadius: number;
      textTransform: string;
      fontWeight: number;
      letterSpacing: string;
      px: number;
      py: number;
      fontSize: {
        xs: string;
        md: string;
      };
    };
  };
  pandaEffect: {
    glow: (color: string) => {
      boxShadow: string;
    };
    hover: {
      transform: string;
      boxShadow: string;
    };
  };
} 