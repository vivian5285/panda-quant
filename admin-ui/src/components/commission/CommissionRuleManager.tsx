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
  Switch,
  FormControlLabel
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

interface CommissionRule {
  _id?: string;
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  minAmount?: number;
  maxAmount?: number;
  levelId?: string;
  status: 'active' | 'inactive';
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const CommissionRuleManager: React.FC = () => {
  const [rules, setRules] = useState<CommissionRule[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingRule, setEditingRule] = useState<CommissionRule | null>(null);
  const [formData, setFormData] = useState<CommissionRule>({
    name: '',
    type: 'percentage',
    value: 0,
    status: 'active',
    description: ''
  });

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const response = await fetch('/api/commission/rules');
      const data = await response.json();
      setRules(data);
    } catch (error) {
      toast.error('Failed to fetch commission rules');
    }
  };

  const handleOpenDialog = (rule?: CommissionRule) => {
    if (rule) {
      setEditingRule(rule);
      setFormData(rule);
    } else {
      setEditingRule(null);
      setFormData({
        name: '',
        type: 'percentage',
        value: 0,
        status: 'active',
        description: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingRule(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingRule
        ? `/api/commission/rules/${editingRule._id}`
        : '/api/commission/rules';
      const method = editingRule ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(
          editingRule
            ? 'Commission rule updated successfully'
            : 'Commission rule created successfully'
        );
        fetchRules();
        handleCloseDialog();
      } else {
        throw new Error('Failed to save commission rule');
      }
    } catch (error) {
      toast.error('Failed to save commission rule');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this commission rule?')) {
      try {
        const response = await fetch(`/api/commission/rules/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          toast.success('Commission rule deleted successfully');
          fetchRules();
        } else {
          throw new Error('Failed to delete commission rule');
        }
      } catch (error) {
        toast.error('Failed to delete commission rule');
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Commission Rules
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Rule
        </Button>
      </Box>

      <Grid container spacing={3}>
        {rules.map((rule) => (
          <Grid item xs={12} sm={6} md={4} key={rule._id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" component="div">
                      {rule.name}
                    </Typography>
                    <Box>
                      <IconButton onClick={() => handleOpenDialog(rule)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(rule._id!)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  <Typography color="text.secondary" gutterBottom>
                    Type: {rule.type}
                  </Typography>
                  <Typography variant="body2">
                    Value: {rule.value} {rule.type === 'percentage' ? '%' : 'USD'}
                  </Typography>
                  {rule.minAmount && (
                    <Typography variant="body2">
                      Min Amount: {rule.minAmount} USD
                    </Typography>
                  )}
                  {rule.maxAmount && (
                    <Typography variant="body2">
                      Max Amount: {rule.maxAmount} USD
                    </Typography>
                  )}
                  <Typography variant="body2" color={rule.status === 'active' ? 'success.main' : 'error.main'}>
                    Status: {rule.status}
                  </Typography>
                  {rule.description && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {rule.description}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingRule ? 'Edit Commission Rule' : 'Add Commission Rule'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={formData.type}
                    label="Type"
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'percentage' | 'fixed' })}
                    required
                  >
                    <MenuItem value="percentage">Percentage</MenuItem>
                    <MenuItem value="fixed">Fixed Amount</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Value"
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
                  required
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Minimum Amount (USD)"
                  type="number"
                  value={formData.minAmount || ''}
                  onChange={(e) => setFormData({ ...formData, minAmount: parseFloat(e.target.value) })}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Maximum Amount (USD)"
                  type="number"
                  value={formData.maxAmount || ''}
                  onChange={(e) => setFormData({ ...formData, maxAmount: parseFloat(e.target.value) })}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.status === 'active'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.checked ? 'active' : 'inactive',
                        })
                      }
                    />
                  }
                  label="Active"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {editingRule ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default CommissionRuleManager; 