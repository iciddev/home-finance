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
    <Card sx={{
      background: '#fff',
      color: '#23272f',
      borderRadius: 6,
      boxShadow: '0 8px 32px 0 rgba(0,255,174,0.10)',
      mb: 4,
      fontFamily: 'Montserrat, Arial, sans-serif',
    }}>
      <CardContent>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4,
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 2,
        }}>
          <Box sx={{ textAlign: 'center', width: { xs: '100%', md: '30%' } }}>
            <Typography variant="subtitle2" sx={{ opacity: 0.85 }}>
              Total Income
            </Typography>
            <Typography variant="h5" sx={{ color: '#388e3c', fontWeight: 700 }}>
              {formatCurrency(totalIncome)}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center', width: { xs: '100%', md: '30%' } }}>
            <Typography variant="subtitle2" sx={{ opacity: 0.85 }}>
              Total Expenses
            </Typography>
            <Typography variant="h5" sx={{ color: '#ff1744', fontWeight: 700 }}>
              {formatCurrency(totalExpenses)}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center', width: { xs: '100%', md: '30%' } }}>
            <Typography variant="subtitle2" sx={{ opacity: 0.85 }}>
              Balance
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                color: balance >= 0 ? '#388e3c' : '#ff1744',
                fontWeight: 900,
                textShadow: '0 2px 8px rgba(0,0,0,0.10)',
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

