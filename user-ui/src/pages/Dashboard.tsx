import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, Box, CircularProgress, Alert } from '@mui/material';
import ProfitChart from '../components/ProfitChart';
import StrategyCard from '../components/StrategyCard';
import axios from 'axios';

interface Strategy {
  _id: string;
  name: string;
  description: string;
  riskLevel: '低' | '中等' | '较高';
  expectedReturn: number;
  active: boolean;
}

const Dashboard: React.FC = () => {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStrategies = async () => {
      try {
        const response = await axios.get('/api/strategy/user-strategies');
        setStrategies(response.data.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching strategies:', err);
        setError('获取策略数据失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    fetchStrategies();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        策略看板
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
          <Alert severity="error">{error}</Alert>
        </Box>
      ) : (
        <>
          {/* 收益图表部分 */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              收益趋势
            </Typography>
            <ProfitChart />
          </Box>

          {/* 策略卡片部分 */}
          <Box>
            <Typography variant="h5" gutterBottom>
              可用策略
            </Typography>
            <Grid container spacing={3}>
              {strategies.map((strategy) => (
                <Grid item xs={12} md={6} key={strategy._id}>
                  <StrategyCard strategy={strategy} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </>
      )}
    </Container>
  );
};

export default Dashboard; 