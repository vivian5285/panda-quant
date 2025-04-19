import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Container,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { getStrategies, createStrategy, updateStrategy, deleteStrategy } from '../api/strategy';

interface ExtendedStrategy {
  _id: string;
  name: string;
  description: string;
  type: 'arbitrage' | 'market_making' | 'trend_following';
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

const StrategyManagement: React.FC = () => {
  const { t } = useTranslation();
  const [strategies, setStrategies] = useState<ExtendedStrategy[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedStrategy, setSelectedStrategy] = useState<ExtendedStrategy | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    type: ExtendedStrategy['type'];
    status: ExtendedStrategy['status'];
  }>({
    name: '',
    description: '',
    type: 'arbitrage',
    status: 'active',
  });

  useEffect(() => {
    fetchStrategies();
  }, []);

  const fetchStrategies = async () => {
    try {
      const data = await getStrategies();
      setStrategies(data.map(strategy => ({
        _id: strategy.id || '',
        name: strategy.name,
        description: strategy.description || '',
        type: 'arbitrage',
        status: 'active'
      })));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching strategies:', error);
      setLoading(false);
    }
  };

  const handleOpenDialog = (strategy?: ExtendedStrategy) => {
    if (strategy) {
      setSelectedStrategy(strategy);
      setFormData({
        name: strategy.name,
        description: strategy.description,
        type: strategy.type,
        status: strategy.status,
      });
    } else {
      setSelectedStrategy(null);
      setFormData({
        name: '',
        description: '',
        type: 'arbitrage',
        status: 'active',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedStrategy(null);
    setFormData({
      name: '',
      description: '',
      type: 'arbitrage',
      status: 'active',
    });
  };

  const handleSubmit = async () => {
    try {
      if (selectedStrategy) {
        await updateStrategy(selectedStrategy._id, formData);
      } else {
        await createStrategy(formData);
      }
      fetchStrategies();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving strategy:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t('strategy.confirmDelete'))) {
      try {
        await deleteStrategy(id);
        fetchStrategies();
      } catch (error) {
        console.error('Error deleting strategy:', error);
      }
    }
  };

  const columns: GridColDef<ExtendedStrategy>[] = [
    { field: 'name', headerName: t('strategy.name'), flex: 1 },
    { field: 'type', headerName: t('strategy.type'), width: 120 },
    { field: 'status', headerName: t('strategy.status'), width: 120 },
    {
      field: 'actions',
      headerName: t('common.actions'),
      flex: 1,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => handleOpenDialog(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row._id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 2,
              bgcolor: '#fff',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
              <Typography variant="h5" sx={{ color: '#333333', fontWeight: 'bold' }}>
                {t('strategy.title')}
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
                sx={{
                  bgcolor: '#00FFB8',
                  '&:hover': {
                    bgcolor: '#00E6A5',
                  },
                }}
              >
                {t('strategy.add')}
              </Button>
            </Box>
            <Box sx={{ height: 400, width: '100%' }}>
              <DataGrid<ExtendedStrategy>
                rows={strategies}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 5, page: 0 },
                  },
                }}
                pageSizeOptions={[5]}
                getRowId={(row) => row._id}
                loading={loading}
              />
            </Box>
          </Paper>
        </motion.div>
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedStrategy ? t('strategy.edit') : t('strategy.add')}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label={t('strategy.name')}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label={t('strategy.description')}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              multiline
              rows={4}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>{t('strategy.type')}</InputLabel>
              <Select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as ExtendedStrategy['type'] })}
                label={t('strategy.type')}
              >
                <MenuItem value="arbitrage">{t('strategy.arbitrage')}</MenuItem>
                <MenuItem value="market_making">{t('strategy.marketMaking')}</MenuItem>
                <MenuItem value="trend_following">{t('strategy.trendFollowing')}</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>{t('strategy.status')}</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as ExtendedStrategy['status'] })}
                label={t('strategy.status')}
              >
                <MenuItem value="active">{t('strategy.active')}</MenuItem>
                <MenuItem value="inactive">{t('strategy.inactive')}</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t('common.cancel')}</Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ bgcolor: '#00FFB8' }}>
            {t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StrategyManagement; 