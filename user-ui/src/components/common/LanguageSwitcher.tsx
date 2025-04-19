import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  useTheme
} from '@mui/material';
import { changeLanguage, getCurrentLanguage, languageNames, SupportedLng } from '../../i18n';
import LanguageIcon from '@mui/icons-material/Language';

const LanguageSwitcher: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const currentLanguage = getCurrentLanguage();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (lng: SupportedLng) => {
    changeLanguage(lng);
    handleClose();
  };

  return (
    <Box>
      <IconButton
        onClick={handleClick}
        sx={{
          color: theme.palette.text.primary,
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        }}
      >
        <LanguageIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 120,
            borderRadius: 2,
            boxShadow: theme.shadows[3],
          },
        }}
      >
        {Object.entries(languageNames).map(([code, name]) => (
          <MenuItem
            key={code}
            onClick={() => handleLanguageChange(code as SupportedLng)}
            selected={code === currentLanguage}
            sx={{
              py: 1,
              px: 2,
              '&.Mui-selected': {
                backgroundColor: theme.palette.primary.light,
                '&:hover': {
                  backgroundColor: theme.palette.primary.light,
                },
              },
            }}
          >
            <Typography variant="body2">{name}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default LanguageSwitcher; 