import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Container, Box, Typography } from '@mui/material';
import { teal, pink } from '@mui/material/colors';
import { format } from 'date-fns';
import { getTransactions, getSummary, addTransaction as apiAddTransaction, deleteTransaction as apiDeleteTransaction } from './services/api';
import { Transaction, Summary, TransactionFormData } from './types/transaction';
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';
import SummaryCard from './components/SummaryCard';
import ExpenseChart from './components/ExpenseChart';

const theme = createTheme({
  palette: {
    primary: teal,
    secondary: pink,
    mode: 'light',
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
});

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<Summary>({ totalIncome: 0, totalExpenses: 0, balance: 0 });
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [transactionsData, summaryData] = await Promise.all([
        getTransactions(),
        getSummary(),
      ]);
      setTransactions(transactionsData);
      setSummary(summaryData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddTransaction = async (formData: TransactionFormData) => {
    try {
      await apiAddTransaction(formData);
      await fetchData();
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const handleDeleteTransaction = async (id: number) => {
    try {
      await apiDeleteTransaction(id);
      await fetchData();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  // Filter transactions for the current month
  const currentMonthTransactions = transactions.filter(
    (transaction) => {
      const transactionDate = new Date(transaction.date);
      const currentDate = new Date();
      return (
        transactionDate.getMonth() === currentDate.getMonth() &&
        transactionDate.getFullYear() === currentDate.getFullYear()
      );
    }
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box mb={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            Home Finance Manager
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {format(new Date(), 'MMMM yyyy')}
          </Typography>
        </Box>

        <Box mb={4}>
          <SummaryCard summary={summary} loading={loading} />
        </Box>

        <Box mb={4}>
          <ExpenseChart transactions={currentMonthTransactions} />
        </Box>


        <Box mb={4}>
          <TransactionForm onSubmit={handleAddTransaction} />
        </Box>


        <Box>
          <TransactionList 
            transactions={transactions} 
            onDelete={handleDeleteTransaction} 
            loading={loading} 
          />
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App;
