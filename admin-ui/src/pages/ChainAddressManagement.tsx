import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import axiosInstance from '../utils/axiosInstance';
import { useTranslation } from 'react-i18next';

interface Chain {
  _id: string;
  name: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

const ChainAddressManagement: React.FC = () => {
  const { t } = useTranslation();
  const [chains, setChains] = useState<Chain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedChain, setSelectedChain] = useState<Chain | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
  });

  useEffect(() => {
    fetchChains();
  }, []);

  const fetchChains = async () => {
    try {
      const response = await axiosInstance.get('/api/admin/chains');
      setChains(response.data);
      setLoading(false);
    } catch (err) {
      setError(t('error.fetchingChains'));
      setLoading(false);
    }
  };

  const handleOpenDialog = (chain?: Chain) => {
    if (chain) {
      setSelectedChain(chain);
      setFormData({
        name: chain.name,
        address: chain.address,
      });
    } else {
      setSelectedChain(null);
      setFormData({
        name: '',
        address: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedChain(null);
  };

  const handleSubmit = async () => {
    try {
      if (selectedChain) {
        await axiosInstance.put(`/api/admin/chains/${selectedChain._id}`, formData);
      } else {
        await axiosInstance.post('/api/admin/chains', formData);
      }
      fetchChains();
      handleCloseDialog();
    } catch (err) {
      setError(t('error.savingChain'));
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t('confirm.deleteChain'))) {
      try {
        await axiosInstance.delete(`/api/admin/chains/${id}`);
        fetchChains();
      } catch (err) {
        setError(t('error.deletingChain'));
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5" component="h1">
            {t('chainAddressManagement')}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            {t('addChain')}
          </Button>
        </Box>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('chainName')}</TableCell>
                <TableCell>{t('chainAddress')}</TableCell>
                <TableCell>{t('createdAt')}</TableCell>
                <TableCell>{t('actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {chains.map((chain) => (
                <TableRow key={chain._id}>
                  <TableCell>{chain.name}</TableCell>
                  <TableCell>{chain.address}</TableCell>
                  <TableCell>
                    {new Date(chain.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Tooltip title={t('edit')}>
                      <IconButton onClick={() => handleOpenDialog(chain)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('delete')}>
                      <IconButton onClick={() => handleDelete(chain._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedChain ? t('editChain') : t('addChain')}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('chainName')}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('chainAddress')}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t('cancel')}</Button>
          <Button onClick={handleSubmit} variant="contained">
            {t('save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ChainAddressManagement; 