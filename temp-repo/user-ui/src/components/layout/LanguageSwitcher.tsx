import React from 'react';
import { Button, Menu, MenuItem, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { themeUtils } from '../../theme';

const languages = [
  { code: 'zh', name: '中文' },
  { code: 'en', name: 'English' },
  { code: 'ja', name: '日本語' },
];

const LanguageSwitcher: React.FC = () => {
  const theme = useTheme();
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    handleClose();
  };

  return (
    <>
      <Button
        onClick={handleClick}
        sx={{
          color: theme.palette.text.primary,
          textTransform: 'none',
          fontWeight: 500,
          '&:hover': {
            color: theme.palette.primary.main,
          },
        }}
      >
        {languages.find((lang) => lang.code === i18n.language)?.name || 'Language'}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx={{
          '& .MuiPaper-root': {
            background: themeUtils.createGradient(
              theme.palette.background.paper,
              theme.palette.background.default
            ),
            borderRadius: theme.shape.borderRadius * 2,
            boxShadow: theme.shadows[8],
          },
        }}
      >
        {languages.map((language) => (
          <MenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            selected={i18n.language === language.code}
            sx={{
              '&:hover': {
                background: `${theme.palette.primary.main}10`,
              },
              '&.Mui-selected': {
                background: `${theme.palette.primary.main}20`,
                '&:hover': {
                  background: `${theme.palette.primary.main}30`,
                },
              },
            }}
          >
            {language.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default LanguageSwitcher; 