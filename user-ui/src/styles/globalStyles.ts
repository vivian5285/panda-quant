import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  palette: {
    primary: {
      main: '#00FFB8',
      light: '#33FFC6',
      dark: '#00B281',
      contrastText: '#000',
    },
    secondary: {
      main: '#00B8FF',
      light: '#33C6FF',
      dark: '#0081B2',
      contrastText: '#000',
    },
    background: {
      default: '#0A0A0A',
      paper: '#1A1A1A',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0',
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"Poppins", "Alibaba PuHuiTi", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
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
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          padding: '8px 24px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
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
});

export const globalStyles = {
  container: {
    maxWidth: 1200,
    mx: 'auto',
    width: '100%',
    px: { xs: 2, sm: 3, md: 4 },
  },
  section: {
    py: { xs: 4, md: 8 },
    position: 'relative',
    overflow: 'hidden',
  },
  card: {
    padding: 24,
    borderRadius: 16,
    backgroundColor: theme.palette.background.paper,
  },
  gradientText: {
    background: 'linear-gradient(45deg, #00FFB8 30%, #00E6A4 90%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexBetween: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textCenter: {
    textAlign: 'center',
  },
  responsiveGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 24,
  },
  colors: {
    primary: '#00FFB8',
    primaryLight: '#00E6A4',
    primaryDark: '#00CC90',
    background: 'rgba(0, 0, 0, 0.8)',
    border: 'rgba(0, 255, 184, 0.1)',
    hover: 'rgba(0, 255, 184, 0.1)',
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  gradients: {
    background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.6) 100%)',
    radial: 'radial-gradient(circle at center, rgba(0, 255, 184, 0.1) 0%, transparent 70%)',
    button: 'linear-gradient(45deg, #00FFB8 30%, #00E6A4 90%)',
    buttonHover: 'linear-gradient(45deg, #00E6A4 30%, #00CC90 90%)',
  },
  animations: {
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 },
    },
  },
}; 