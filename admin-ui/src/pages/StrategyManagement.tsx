import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  Tooltip,
  Container,
  LinearProgress,
  Alert,
  Avatar,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import PageLayout from '../components/common/PageLayout';
import { animationConfig } from '../theme/animation';
import { getStrategies, createStrategy, updateStrategy, deleteStrategy, Strategy } from '../api/strategies';

const StrategyManagement: React.FC = () => {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    riskLevel: 'all',
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);

  useEffect(() => {
    fetchStrategies();
  }, []);

  const fetchStrategies = async () => {
    try {
      setLoading(true);
      const data = await getStrategies();
      setStrategies(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch strategies');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleFilterChange = (filter: string) => (event: SelectChangeEvent) => {
    setFilters({ ...filters, [filter]: event.target.value });
    setPage(0);
  };

  const handleDialogOpen = (strategy?: Strategy) => {
    setSelectedStrategy(strategy || null);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedStrategy(null);
  };

  const handleSaveStrategy = async (strategyData: Partial<Strategy>) => {
    try {
      if (selectedStrategy) {
        await updateStrategy({ ...selectedStrategy, ...strategyData });
      } else {
        await createStrategy(strategyData);
      }
      fetchStrategies();
      handleDialogClose();
    } catch (err) {
      setError('Failed to save strategy');
      console.error(err);
    }
  };

  const handleDeleteStrategy = async (id: string) => {
    try {
      await deleteStrategy(id);
      fetchStrategies();
    } catch (err) {
      setError('Failed to delete strategy');
      console.error(err);
    }
  };

  const filteredStrategies = strategies.filter((strategy) => {
    const matchesSearch = strategy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      strategy.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filters.type === 'all' || strategy.type === filters.type;
    const matchesStatus = filters.status === 'all' || strategy.status === filters.status;
    const matchesRiskLevel = filters.riskLevel === 'all' || strategy.riskLevel === filters.riskLevel;
    return matchesSearch && matchesType && matchesStatus && matchesRiskLevel;
  });

  const renderFilters = () => (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item={true} xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search strategies..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item={true} xs={12} sm={6} md={3}>
        <Select
          fullWidth
          value={filters.type}
          onChange={handleFilterChange('type')}
          variant="outlined"
        >
          <MenuItem value="all">All Types</MenuItem>
          <MenuItem value="momentum">Momentum</MenuItem>
          <MenuItem value="mean_reversion">Mean Reversion</MenuItem>
          <MenuItem value="arbitrage">Arbitrage</MenuItem>
          <MenuItem value="other">Other</MenuItem>
        </Select>
      </Grid>
      <Grid item={true} xs={12} sm={6} md={3}>
        <Select
          fullWidth
          value={filters.status}
          onChange={handleFilterChange('status')}
          variant="outlined"
        >
          <MenuItem value="all">All Status</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
          <MenuItem value="testing">Testing</MenuItem>
        </Select>
      </Grid>
      <Grid item={true} xs={12} sm={6} md={3}>
        <Select
          fullWidth
          value={filters.riskLevel}
          onChange={handleFilterChange('riskLevel')}
          variant="outlined"
        >
          <MenuItem value="all">All Risk Levels</MenuItem>
          <MenuItem value="low">Low</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="high">High</MenuItem>
        </Select>
      </Grid>
    </Grid>
  );

  const renderContent = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: animationConfig.duration.medium }}
    >
      <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Risk Level</TableCell>
              <TableCell>Performance</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStrategies
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((strategy) => (
                <TableRow key={strategy.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {strategy.name}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {strategy.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={strategy.type}
                      color="primary"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={strategy.status}
                      color={
                        strategy.status === 'active'
                          ? 'success'
                          : strategy.status === 'testing'
                          ? 'warning'
                          : 'error'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={strategy.riskLevel}
                      color={
                        strategy.riskLevel === 'low'
                          ? 'success'
                          : strategy.riskLevel === 'medium'
                          ? 'warning'
                          : 'error'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TrendingUpIcon color="success" fontSize="small" />
                        <Typography variant="body2">
                          Profit: ${strategy.performance.totalProfit.toLocaleString()}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <WarningIcon color="warning" fontSize="small" />
                        <Typography variant="body2">
                          Drawdown: {(strategy.performance.maxDrawdown * 100).toFixed(1)}%
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => handleDialogOpen(strategy)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteStrategy(strategy.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={filteredStrategies.length}
        page={page}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </motion.div>
  );

  const renderActions = () => (
    <Button
      variant="contained"
      startIcon={<AddIcon />}
      onClick={() => handleDialogOpen()}
    >
      Add Strategy
    </Button>
  );

  return (
    <PageLayout
      title="Strategy Management"
      actions={renderActions()}
      filters={renderFilters()}
    >
      {renderContent()}
    </PageLayout>
  );
};

export default StrategyManagement; 