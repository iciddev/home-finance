import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Transaction } from '../types/transaction';

interface ExpenseChartProps {
  transactions: Transaction[];
}

const ExpenseChart: React.FC<ExpenseChartProps> = ({ transactions }) => {
  // Group transactions by category and sum amounts
  const categoryData = transactions.reduce((acc, transaction) => {
    if (transaction.type === 'expense') {
      if (!acc[transaction.category]) {
        acc[transaction.category] = 0;
      }
      acc[transaction.category] += Math.abs(transaction.amount);
    }
    return acc;
  }, {} as Record<string, number>);

  // Convert to array for the chart
  const chartData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    amount: parseFloat(value.toFixed(2))
  }));

  // Sort by amount in descending order
  chartData.sort((a, b) => b.amount - a.amount);

  // Format category names for display
  const formatCategory = (category: string) => {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (chartData.length === 0) {
    return null; // Don't show the chart if there's no expense data
  }

  return (
    <Card sx={{
      background: '#fff',
      color: '#23272f',
      borderRadius: 8,
      boxShadow: '0 8px 32px 0 rgba(0,255,174,0.10)',
      mb: 4,
      fontFamily: 'Montserrat, Arial, sans-serif',
    }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ color: '#23272f', fontWeight: 900 }}>
          Expenses by Category
        </Typography>
        <Box sx={{ height: 300, width: '100%' }}>
          <ResponsiveContainer>
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#fff6" />
              <XAxis 
                dataKey="name" 
                tickFormatter={formatCategory}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
                labelFormatter={formatCategory}
              />
              <Bar 
                dataKey="amount" 
                name="Amount" 
                fill="#8884d8"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ExpenseChart;
