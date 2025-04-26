import React from 'react';
import {
  Box,
  Typography,
  Chip,
  LinearProgress,
  Grid,
} from '@mui/material';
import { UserProfile as UserProfileType } from '@/api/user';
import {
  StyledCard,
  StyledBox,
  StyledTypography,
} from '../common/StyledComponents';
import { themeUtils } from '../../theme';

interface UserProfileProps {
  profile: UserProfileType;
}

const UserProfile: React.FC<UserProfileProps> = ({ profile }) => {
  const {
    riskTolerance,
    tradingExperience,
    preferredChains,
    strategyPreferences,
    lastActiveTime,
    totalTrades,
    successRate,
    averageReturn,
  } = profile;

  const riskToleranceColor = {
    low: 'success',
    medium: 'warning',
    high: 'error',
  };

  return (
    <StyledCard>
      <StyledBox>
        <StyledTypography variant="h6" gutterBottom>
          用户画像
        </StyledTypography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ mb: 2 }}>
              <StyledTypography variant="subtitle2" color="text.secondary">
                风险承受能力
              </StyledTypography>
              <Chip
                label={riskTolerance === 'low' ? '低' : riskTolerance === 'medium' ? '中' : '高'}
                color={riskToleranceColor[riskTolerance] as 'success' | 'warning' | 'error'}
                sx={{ mt: 1 }}
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ mb: 2 }}>
              <StyledTypography variant="subtitle2" color="text.secondary">
                交易经验
              </StyledTypography>
              <StyledTypography>
                {tradingExperience} 年
              </StyledTypography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ mb: 2 }}>
              <StyledTypography variant="subtitle2" color="text.secondary">
                偏好链
              </StyledTypography>
              <Box sx={{ mt: 1 }}>
                {preferredChains.map(chain => (
                  <Chip
                    key={chain}
                    label={chain}
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ mb: 2 }}>
              <StyledTypography variant="subtitle2" color="text.secondary">
                偏好策略
              </StyledTypography>
              <Box sx={{ mt: 1 }}>
                {strategyPreferences.map(strategy => (
                  <Chip
                    key={strategy}
                    label={strategy}
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ mb: 2 }}>
              <StyledTypography variant="subtitle2" color="text.secondary">
                最后活跃时间
              </StyledTypography>
              <StyledTypography>
                {new Date(lastActiveTime).toLocaleString()}
              </StyledTypography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ mb: 2 }}>
              <StyledTypography variant="subtitle2" color="text.secondary">
                总交易次数
              </StyledTypography>
              <StyledTypography>
                {totalTrades}
              </StyledTypography>
            </Box>
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6}>
            <StyledCard>
              <StyledBox>
                <StyledTypography variant="subtitle1" gutterBottom>
                  交易成功率
                </StyledTypography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: '100%', mr: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={successRate * 100}
                      color={successRate >= 0.7 ? 'success' : successRate >= 0.5 ? 'primary' : 'error'}
                      sx={{ height: 10, borderRadius: 5 }}
                    />
                  </Box>
                  <Box sx={{ minWidth: 35 }}>
                    <StyledTypography variant="body2" color="text.secondary">
                      {`${Math.round(successRate * 100)}%`}
                    </StyledTypography>
                  </Box>
                </Box>
              </StyledBox>
            </StyledCard>
          </Grid>

          <Grid item xs={12} sm={6}>
            <StyledCard>
              <StyledBox>
                <StyledTypography variant="subtitle1" gutterBottom>
                  平均收益率
                </StyledTypography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: '100%', mr: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={Math.abs(averageReturn) * 100}
                      color={averageReturn >= 0 ? 'success' : 'error'}
                      sx={{ height: 10, borderRadius: 5 }}
                    />
                  </Box>
                  <Box sx={{ minWidth: 35 }}>
                    <StyledTypography variant="body2" color="text.secondary">
                      {`${Math.round(averageReturn * 100)}%`}
                    </StyledTypography>
                  </Box>
                </Box>
              </StyledBox>
            </StyledCard>
          </Grid>
        </Grid>
      </StyledBox>
    </StyledCard>
  );
};

export default UserProfile; 