import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab
} from '@mui/material';
import { Edit as EditIcon, Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';

interface Withdrawal {
  _id: string;
  userId: {
    _id: string;
    username: string;
    email: string;
  };
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  paymentMethod: string;
  paymentDetails: any;
  createdAt: string;
  processedAt?: string;
  completedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  notes?: string;
}

const WithdrawalManager: React.FC = () => {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null);
  const [formData, setFormData] = useState({
    status: '',
    notes: ''
  });

  useEffect(() => {
    fetchWithdrawals();
  }, [selectedTab]);

  const fetchWithdrawals = async () => {
    try {
      const status = ['pending', 'approved', 'rejected', 'completed'][selectedTab];
      const response = await fetch(`/api/withdrawals?status=${status}`);
      const data = await response.json();
      setWithdrawals(data);
    } catch (error) {
      toast.error('Failed to fetch withdrawals');
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleOpenDialog = (withdrawal: Withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setFormData({
      status: withdrawal.status,
      notes: withdrawal.notes || ''
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedWithdrawal(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWithdrawal) return;

    try {
      const response = await fetch(`/api/withdrawals/${selectedWithdrawal._id}/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Withdrawal processed successfully');
        fetchWithdrawals();
        handleCloseDialog();
      } else {
        throw new Error('Failed to process withdrawal');
      }
    } catch (error) {
      toast.error('Failed to process withdrawal');
    }
  };

  const handleComplete = async (withdrawalId: string) => {
    try {
      const response = await fetch(`/api/withdrawals/${withdrawalId}/complete`, {
        method: 'POST',
      });

      if (response.ok) {
        toast.success('Withdrawal completed successfully');
        fetchWithdrawals();
      } else {
        throw new Error('Failed to complete withdrawal');
      }
    } catch (error) {
      toast.error('Failed to complete withdrawal');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'approved':
        return 'info';
      case 'rejected':
        return 'error';
      case 'completed':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Withdrawal Management
      </Typography>

      <Tabs value={selectedTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Pending" />
        <Tab label="Approved" />
        <Tab label="Rejected" />
        <Tab label="Completed" />
      </Tabs>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {withdrawals.map((withdrawal) => (
              <TableRow key={withdrawal._id}>
                <TableCell>
                  <Typography>{withdrawal.userId.username}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {withdrawal.userId.email}
                  </Typography>
                </TableCell>
                <TableCell>${withdrawal.amount.toFixed(2)}</TableCell>
                <TableCell>{withdrawal.paymentMethod}</TableCell>
                <TableCell>
                  <Chip
                    label={withdrawal.status}
                    color={getStatusColor(withdrawal.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(withdrawal.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  {withdrawal.status === 'pending' && (
                    <IconButton onClick={() => handleOpenDialog(withdrawal)}>
                      <EditIcon />
                    </IconButton>
                  )}
                  {withdrawal.status === 'approved' && (
                    <IconButton onClick={() => handleComplete(withdrawal._id)}>
                      <CheckIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Process Withdrawal</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    label="Status"
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    required
                  >
                    <MenuItem value="approved">Approve</MenuItem>
                    <MenuItem value="rejected">Reject</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  multiline
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </Grid>
              {selectedWithdrawal && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Payment Details:
                  </Typography>
                  <pre style={{ margin: 0 }}>
                    {JSON.stringify(selectedWithdrawal.paymentDetails, null, 2)}
                  </pre>
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Process
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default WithdrawalManager; 