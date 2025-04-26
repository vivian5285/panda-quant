import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { fadeIn, slideUp } from '../../animations';
import { StyledCard } from '../../components/common/StyledCard';
import { GradientTitle } from '../../components/common/GradientTitle';

const CookiesPolicy = () => {
  const { t } = useTranslation();

  const cookieTypes = [
    {
      name: t('cookies.essential.title', '必要 Cookie'),
      description: t('cookies.essential.description', '这些 Cookie 对于网站的基本功能是必需的，无法关闭。它们通常仅用于响应您所做的操作，例如设置隐私偏好、登录或填写表单。'),
    },
    {
      name: t('cookies.analytics.title', '分析 Cookie'),
      description: t('cookies.analytics.description', '这些 Cookie 帮助我们了解访问者如何与网站互动。它们帮助我们改进网站的功能和用户体验。'),
    },
    {
      name: t('cookies.functional.title', '功能 Cookie'),
      description: t('cookies.functional.description', '这些 Cookie 使网站能够提供增强的功能和个性化设置。它们可能由我们或第三方提供商设置。'),
    },
    {
      name: t('cookies.marketing.title', '营销 Cookie'),
      description: t('cookies.marketing.description', '这些 Cookie 用于跟踪访问者跨网站的行为。目的是显示与个人用户相关和吸引人的广告。'),
    },
  ];

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={fadeIn}
    >
      <Container maxWidth="md">
        <Box sx={{ py: 8 }}>
          <motion.div variants={slideUp}>
            <GradientTitle variant="h3" align="center" gutterBottom>
              {t('cookies.title', 'Cookie 政策')}
            </GradientTitle>
          </motion.div>

          <StyledCard>
            <Box sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom>
                {t('cookies.introduction.title', '什么是 Cookie？')}
              </Typography>
              <Typography paragraph>
                {t('cookies.introduction.content', 'Cookie 是当您访问网站时存储在您设备上的小型文本文件。它们被广泛用于使网站工作或更有效地工作，以及向网站所有者提供信息。')}
              </Typography>

              <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                {t('cookies.types.title', '我们使用的 Cookie 类型')}
              </Typography>
              <List>
                {cookieTypes.map((type, index) => (
                  <React.Fragment key={type.name}>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {type.name}
                          </Typography>
                        }
                        secondary={type.description}
                      />
                    </ListItem>
                    {index < cookieTypes.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>

              <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                {t('cookies.control.title', '如何控制 Cookie')}
              </Typography>
              <Typography paragraph>
                {t('cookies.control.content', '您可以通过浏览器设置控制或删除 Cookie。如果您禁用 Cookie，请注意，网站的某些部分可能无法正常工作。')}
              </Typography>

              <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                {t('cookies.contact.title', '联系我们')}
              </Typography>
              <Typography paragraph>
                {t('cookies.contact.content', '如果您对我们的 Cookie 政策有任何疑问，请通过以下方式联系我们：')}
              </Typography>
              <Typography>
                {t('cookies.contact.email', '电子邮件：')} privacy@pandaquant.com
              </Typography>
            </Box>
          </StyledCard>
        </Box>
      </Container>
    </motion.div>
  );
};

export default CookiesPolicy; 