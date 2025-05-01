import { styled } from '@mui/material/styles';
import { Box, Card, Button, Typography, Paper } from '@mui/material';
import theme from '../../theme';

export const StyledBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.custom.shadows.card,
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: theme.custom.shadows.cardHover,
    transform: 'translateY(-2px)',
  },
}));

export const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 1.5,
  boxShadow: theme.custom.shadows.card,
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: theme.custom.shadows.cardHover,
    transform: 'translateY(-2px)',
  },
}));

export const StyledButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  color: theme.palette.common.white,
  '&:hover': {
    background: `linear-gradient(45deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
  },
}));

export const StyledTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 700,
}));

export const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  background: theme.custom.gradients.primary,
  boxShadow: theme.custom.shadows.card,
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: theme.custom.shadows.cardHover,
    transform: 'translateY(-2px)',
  },
}));

export const StyledContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  padding: theme.spacing(4),
  background: theme.custom.gradients.primary,
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 700,
  marginBottom: theme.spacing(4),
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -theme.spacing(1),
    left: 0,
    width: '60px',
    height: '4px',
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, transparent)`,
    borderRadius: '2px',
  },
})); 