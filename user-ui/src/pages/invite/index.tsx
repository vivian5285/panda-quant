import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  useTheme,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { themeUtils } from '../../theme';
import PandaCard from '../../components/common/PandaCard';
import PandaButton from '../../components/common/PandaButton';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GroupsIcon from '@mui/icons-material/Groups';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import SecurityIcon from '@mui/icons-material/Security';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { Timeline as TimelineIcon } from '@mui/icons-material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ShareIcon from '@mui/icons-material/Share';
import GroupIcon from '@mui/icons-material/Group';
import VisibilityIcon from '@mui/icons-material/Visibility';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const AnimatedPaper = motion(Paper);

const InvitePage: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/invite/link');
  };

  return (
    <Box
      sx={{
        background: themeUtils.createGradient(
          theme.palette.background.default,
          theme.palette.background.paper
        ),
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 50% 0%, rgba(0, 255, 184, 0.1) 0%, rgba(0, 255, 184, 0) 50%)',
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 8 }}>
        {/* 标题部分 */}
        <Box textAlign="center" mb={6}>
          <Typography variant="h2" component="h1" gutterBottom>
            {t('invite.title')}
          </Typography>
          <Typography variant="h5" color="text.secondary">
            {t('invite.subtitle')}
          </Typography>
        </Box>

        {/* 返佣等级说明 */}
        <Box mb={6}>
          <Typography variant="h4" gutterBottom>
            返佣等级说明
          </Typography>
          <Paper sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box textAlign="center">
                  <Typography variant="h6" color="primary">一级好友</Typography>
                  <Typography variant="h4" color="primary">20%</Typography>
                  <Typography color="text.secondary">直接邀请的好友</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box textAlign="center">
                  <Typography variant="h6" color="primary">二级好友</Typography>
                  <Typography variant="h4" color="primary">10%</Typography>
                  <Typography color="text.secondary">好友邀请的好友</Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Box>

        {/* 主要优势 */}
        <Grid container spacing={4} mb={6}>
          <Grid item xs={12} md={4}>
            <Paper
              sx={{ 
                p: 3, 
                height: '100%',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}
            >
              <Box display="flex" alignItems="center" mb={2}>
                <EmojiEventsIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h5">高额返佣</Typography>
              </Box>
              <Typography variant="body1" color="text.secondary" paragraph>
                邀请好友交易，享受高达20%的返佣奖励。一级好友交易，您可获得20%的返佣；二级好友交易，您可获得10%的返佣。
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              sx={{ 
                p: 3, 
                height: '100%',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}
            >
              <Box display="flex" alignItems="center" mb={2}>
                <TimelineIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h5">永久收益</Typography>
              </Box>
              <Typography variant="body1" color="text.secondary" paragraph>
                邀请关系永久有效，您将永久享受好友交易产生的返佣收益。实时结算，随时可提现，让您的收益源源不断。
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              sx={{ 
                p: 3, 
                height: '100%',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}
            >
              <Box display="flex" alignItems="center" mb={2}>
                <LocalOfferIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h5">多重奖励</Typography>
              </Box>
              <Typography variant="body1" color="text.secondary" paragraph>
                邀请好友注册即送100USDT，好友首次交易再送50USDT。邀请好友越多，奖励越多，让您的收益倍增。
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* 为什么选择我们的邀请计划 */}
        <Box mb={6}>
          <Typography variant="h4" gutterBottom>
            为什么选择我们的邀请计划
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <SecurityIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">安全可靠</Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" paragraph>
                  采用银行级安全技术，确保您的邀请收益安全可靠。所有交易数据实时记录，收益透明可查。
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <GroupIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">团队支持</Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" paragraph>
                  专业团队7*24小时为您提供支持，解决您在邀请过程中遇到的任何问题。定期举办邀请活动，让您的收益更上一层楼。
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <VisibilityIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">收益透明</Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" paragraph>
                  实时查看邀请收益，清晰了解每一笔返佣来源。支持多种提现方式，让您的收益随时到账。
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* 邀请流程 */}
        <Box mb={6}>
          <Typography variant="h4" gutterBottom>
            邀请流程
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <ShareIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
                <Typography variant="h6" gutterBottom>获取邀请链接</Typography>
                <Typography variant="body1" color="text.secondary">
                  登录后获取您的专属邀请链接
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <AccountBalanceIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
                <Typography variant="h6" gutterBottom>分享邀请链接</Typography>
                <Typography variant="body1" color="text.secondary">
                  通过社交媒体或直接分享给好友
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <TrendingUpIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
                <Typography variant="h6" gutterBottom>获得返佣奖励</Typography>
                <Typography variant="body1" color="text.secondary">
                  好友注册并交易后，您即可获得返佣奖励
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* 立即开始按钮 */}
        <Box textAlign="center" mt={6}>
          <Button
            variant="contained"
            size="large"
            onClick={handleGetStarted}
            sx={{
              bgcolor: '#00FFB8',
              color: '#333333',
              '&:hover': {
                bgcolor: '#00E6A5',
              },
            }}
          >
            立即开始邀请
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default InvitePage; 