import React, { useState } from 'react';
import { Button, TextField, MenuItem, Paper, Typography, Box, InputAdornment } from '@mui/material';
import { TransactionFormData } from '../types/transaction';

const categories = [
  { value: 'salary', label: 'Salary' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'investments', label: 'Investments' },
  { value: 'gifts', label: 'Gifts' },
  { value: 'groceries', label: 'Groceries' },
  { value: 'dining', label: 'Dining Out' },
  { value: 'transportation', label: 'Transportation' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'health', label: 'Health' },
  { value: 'other', label: 'Other' },
];

interface TransactionFormProps {
  onSubmit: (data: Omit<TransactionFormData, 'id'>) => void;
  initialValues?: Omit<TransactionFormData, 'id'>;
  onCancel?: () => void;
  submitLabel?: string;
  submitLoading?: boolean;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit, initialValues, onCancel, submitLabel, submitLoading }) => {
  const [formData, setFormData] = useState<Omit<TransactionFormData, 'id'>>({
    description: initialValues?.description || '',
    amount: initialValues?.amount || '',
    type: initialValues?.type || 'expense',
    category: initialValues?.category || 'other',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.description.trim() && formData.amount) {
      onSubmit(formData);
      setFormData({
        description: '',
        amount: '',
        type: 'expense',
        category: 'other',
      });
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Add New Transaction
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          <Box sx={{ display: 'flex' }}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              variant="outlined"
            />
          </Box>
          <Box sx={{ display: 'flex' }}>
            <TextField
              fullWidth
              label="Amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              required
              variant="outlined"
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                inputProps: { min: '0.01', step: '0.01' },
              }}
            />
          </Box>
          <Box sx={{ display: 'flex' }}>
            <TextField
              select
              fullWidth
              label="Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              variant="outlined"
            >
              <MenuItem value="income">Income</MenuItem>
              <MenuItem value="expense">Expense</MenuItem>
            </TextField>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <TextField
              select
              fullWidth
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              variant="outlined"
            >
              {categories.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gridColumn: { xs: '1 / -1' } }}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={!formData.description.trim() || !formData.amount || submitLoading}
              sx={{ mr: onCancel ? 1 : 0 }}
              {...(submitLoading ? { loading: true } : {})}
            >
              {submitLabel || 'Add Transaction'}
            </Button>
            {onCancel && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={onCancel}
              >
                Cancel
              </Button>
            )}
          </Box>
        </Box>
      </form>
    </Paper>
  );
};

export default TransactionForm;
