import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import { Edit as EditIcon, Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { getChains, createChain, updateChain, deleteChain, ChainAddress } from '../api/chain';

const ChainAddressManager: React.FC = () => {
  const [chains, setChains] = useState<ChainAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingChain, setEditingChain] = useState<ChainAddress | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: ''
  });

  useEffect(() => {
    fetchChains();
  }, []);

  const fetchChains = async () => {
    try {
      const data = await getChains();
      setChains(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch chain addresses');
      console.error('Error fetching chains:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (chain?: ChainAddress) => {
    if (chain) {
      setEditingChain(chain);
      setFormData({
        name: chain.name,
        address: chain.address
      });
    } else {
      setEditingChain(null);
      setFormData({
        name: '',
        address: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingChain(null);
    setFormData({
      name: '',
      address: ''
    });
  };

  const handleSubmit = async () => {
    try {
      if (editingChain) {
        await updateChain(editingChain._id, formData);
      } else {
        await createChain(formData);
      }
      handleCloseDialog();
      fetchChains();
    } catch (err) {
      console.error('Error saving chain:', err);
      setError('Failed to save chain address');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this chain?')) {
      try {
        await deleteChain(id);
        fetchChains();
      } catch (err) {
        console.error('Error deleting chain:', err);
        setError('Failed to delete chain');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Chain Address Management</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add New Chain
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Chain Name</TableCell>
              <TableCell>USDT Address</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {chains.map((chain) => (
              <TableRow key={chain._id}>
                <TableCell>{chain.name}</TableCell>
                <TableCell>{chain.address}</TableCell>
                <TableCell>
                  {chain.isActive ? 'Active' : 'Inactive'}
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(chain)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(chain._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {editingChain ? 'Edit Chain Address' : 'Add New Chain'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Chain Name"
            type="text"
            fullWidth
            value={formData.name}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="address"
            label="USDT Address"
            type="text"
            fullWidth
            value={formData.address}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingChain ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ChainAddressManager; 