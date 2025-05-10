import React from 'react';
import { Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import { Summary } from '../types/transaction';
import { formatCurrency } from '../utils/formatters';

interface SummaryCardProps {
  summary: Summary;
  loading: boolean;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ summary, loading }) => {
  const { totalIncome, totalExpenses, balance } = summary;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box sx={{ textAlign: 'center', width: { xs: '100%', md: '30%' } }}>
            <Typography variant="subtitle2" color="textSecondary">
              Total Income
            </Typography>
            <Typography variant="h5" sx={{ color: 'success.main' }}>
              {formatCurrency(totalIncome)}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center', width: { xs: '100%', md: '30%' } }}>
            <Typography variant="subtitle2" color="textSecondary">
              Total Expenses
            </Typography>
            <Typography variant="h5" sx={{ color: 'error.main' }}>
              {formatCurrency(totalExpenses)}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center', width: { xs: '100%', md: '30%' } }}>
            <Typography variant="subtitle2" color="textSecondary">
              Balance
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                color: balance >= 0 ? 'success.main' : 'error.main',
                fontWeight: 'bold' 
              }}
            >
              {formatCurrency(balance)}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
