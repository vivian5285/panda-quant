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
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip
} from '@mui/material';
import { toast } from 'react-toastify';

interface Withdrawal {
  _id: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  paymentMethod: string;
  paymentDetails: any;
  createdAt: string;
  processedAt?: string;
  completedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
}

const UserWithdrawal: React.FC = () => {
  const [balance, setBalance] = useState(0);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    paymentMethod: '',
    paymentDetails: {
      accountNumber: '',
      bankName: '',
      swiftCode: ''
    }
  });

  useEffect(() => {
    fetchBalance();
    fetchWithdrawals();
  }, []);

  const fetchBalance = async () => {
    try {
      const response = await fetch('/api/commission/balance');
      const data = await response.json();
      setBalance(data.balance);
    } catch (error) {
      toast.error('Failed to fetch commission balance');
    }
  };

  const fetchWithdrawals = async () => {
    try {
      const response = await fetch('/api/withdrawals/history');
      const data = await response.json();
      setWithdrawals(data);
    } catch (error) {
      toast.error('Failed to fetch withdrawal history');
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      amount: '',
      paymentMethod: '',
      paymentDetails: {
        accountNumber: '',
        bankName: '',
        swiftCode: ''
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/withdrawals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Withdrawal request created successfully');
        fetchBalance();
        fetchWithdrawals();
        handleCloseDialog();
      } else {
        throw new Error('Failed to create withdrawal request');
      }
    } catch (error) {
      toast.error('Failed to create withdrawal request');
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
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Commission Balance
              </Typography>
              <Typography variant="h4" color="primary">
                ${balance.toFixed(2)}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenDialog}
                sx={{ mt: 2 }}
                disabled={balance <= 0}
              >
                Request Withdrawal
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Withdrawal History
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Amount</TableCell>
                  <TableCell>Payment Method</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Processed At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {withdrawals.map((withdrawal) => (
                  <TableRow key={withdrawal._id}>
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
                      {withdrawal.processedAt
                        ? new Date(withdrawal.processedAt).toLocaleString()
                        : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Request Withdrawal</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  inputProps={{ min: 0, max: balance, step: 0.01 }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Payment Method</InputLabel>
                  <Select
                    value={formData.paymentMethod}
                    label="Payment Method"
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    required
                  >
                    <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                    <MenuItem value="paypal">PayPal</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {formData.paymentMethod === 'bank_transfer' && (
                <>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Account Number"
                      value={formData.paymentDetails.accountNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          paymentDetails: {
                            ...formData.paymentDetails,
                            accountNumber: e.target.value
                          }
                        })
                      }
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Bank Name"
                      value={formData.paymentDetails.bankName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          paymentDetails: {
                            ...formData.paymentDetails,
                            bankName: e.target.value
                          }
                        })
                      }
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="SWIFT Code"
                      value={formData.paymentDetails.swiftCode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          paymentDetails: {
                            ...formData.paymentDetails,
                            swiftCode: e.target.value
                          }
                        })
                      }
                      required
                    />
                  </Grid>
                </>
              )}
              {formData.paymentMethod === 'paypal' && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="PayPal Email"
                    type="email"
                    value={formData.paymentDetails.paypalEmail}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paymentDetails: {
                          ...formData.paymentDetails,
                          paypalEmail: e.target.value
                        }
                      })
                    }
                    required
                  />
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default UserWithdrawal; 