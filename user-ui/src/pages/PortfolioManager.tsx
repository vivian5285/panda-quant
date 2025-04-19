import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

interface Portfolio {
  id: number;
  name: string;
  description: string;
  strategies: PortfolioStrategy[];
  performance: PortfolioPerformance;
}

interface PortfolioStrategy {
  id: number;
  name: string;
  weight: number;
  performance: StrategyPerformance;
}

interface StrategyPerformance {
  totalProfit: number;
  maxDrawdown: number;
  winRate: number;
  sharpeRatio: number;
  sortinoRatio: number;
  volatility: number;
}

interface PortfolioPerformance {
  totalProfit: number;
  maxDrawdown: number;
  winRate: number;
  sharpeRatio: number;
  sortinoRatio: number;
  volatility: number;
  correlation: number[][];
  dailyReturns: { date: string; return: number }[];
}

const PortfolioManager: React.FC = () => {
  const { t } = useTranslation();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newPortfolio, setNewPortfolio] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    try {
      const response = await fetch('/api/portfolios');
      if (!response.ok) throw new Error('Failed to fetch portfolios');
      const data = await response.json();
      setPortfolios(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePortfolio = async () => {
    try {
      const response = await fetch('/api/portfolios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPortfolio)
      });
      if (!response.ok) throw new Error('Failed to create portfolio');
      await fetchPortfolios();
      setOpenDialog(false);
      setNewPortfolio({ name: '', description: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">
          {t('portfolioManager.title')}
        </Typography>
        <Button variant="contained" onClick={() => setOpenDialog(true)}>
          {t('portfolioManager.create')}
        </Button>
      </Box>

      <Grid container spacing={3}>
        {portfolios.map((portfolio) => (
          <Grid item xs={12} sm={6} md={4} key={portfolio.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {portfolio.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {portfolio.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Strategies: {portfolio.strategies.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>创建新策略组合</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="组合名称"
            fullWidth
            value={newPortfolio.name}
            onChange={(e) => setNewPortfolio({ ...newPortfolio, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="描述"
            fullWidth
            multiline
            rows={4}
            value={newPortfolio.description}
            onChange={(e) => setNewPortfolio({ ...newPortfolio, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>取消</Button>
          <Button onClick={handleCreatePortfolio} color="primary">创建</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PortfolioManager; 