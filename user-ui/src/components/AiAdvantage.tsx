import { Box, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const StyledBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
  '&:hover': {
    boxShadow: theme.shadows[3],
    transition: theme.transitions.create(['box-shadow'], {
      duration: theme.transitions.duration.standard
    })
  }
}));

const FeatureList = styled('ul')({
  listStyleType: 'none',
  padding: 0,
  margin: 0
});

const FeatureItem = styled('li')(({ theme }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.default,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    transition: theme.transitions.create(['background-color'], {
      duration: theme.transitions.duration.shortest
    })
  }
}));

const AiAdvantage = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  
  return (
    <StyledBox>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography 
          variant="h4" 
          component="h2" 
          gutterBottom
          sx={{ color: theme.palette.text.primary }}
        >
          {t('home.aiAdvantage.title')}
        </Typography>
        <Typography 
          variant="body1" 
          paragraph
          sx={{ color: theme.palette.text.secondary }}
        >
          {t('home.aiAdvantage.description')}
        </Typography>
        <FeatureList>
          <FeatureItem>
            <Typography 
              variant="h6"
              sx={{ color: theme.palette.text.primary }}
            >
              {t('home.aiAdvantage.features.analysis.title')}
            </Typography>
            <Typography 
              variant="body2"
              sx={{ color: theme.palette.text.secondary }}
            >
              {t('home.aiAdvantage.features.analysis.description')}
            </Typography>
          </FeatureItem>
          <FeatureItem>
            <Typography 
              variant="h6"
              sx={{ color: theme.palette.text.primary }}
            >
              {t('home.aiAdvantage.features.pattern.title')}
            </Typography>
            <Typography 
              variant="body2"
              sx={{ color: theme.palette.text.secondary }}
            >
              {t('home.aiAdvantage.features.pattern.description')}
            </Typography>
          </FeatureItem>
          <FeatureItem>
            <Typography 
              variant="h6"
              sx={{ color: theme.palette.text.primary }}
            >
              {t('home.aiAdvantage.features.risk.title')}
            </Typography>
            <Typography 
              variant="body2"
              sx={{ color: theme.palette.text.secondary }}
            >
              {t('home.aiAdvantage.features.risk.description')}
            </Typography>
          </FeatureItem>
        </FeatureList>
      </motion.div>
    </StyledBox>
  );
};

export default AiAdvantage;

 