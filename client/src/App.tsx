import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Container, Box, Typography } from '@mui/material';
import './fonts.css';
import { teal, pink } from '@mui/material/colors';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { format } from 'date-fns';
import { getTransactions, getSummary, addTransaction as apiAddTransaction, deleteTransaction as apiDeleteTransaction, updateTransaction as apiUpdateTransaction } from './services/api';

import { Transaction, Summary, TransactionFormData } from './types/transaction';
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';
import SummaryCard from './components/SummaryCard';
import ExpenseChart from './components/ExpenseChart';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#388e3c', // Solid green
      contrastText: '#fff',
    },
    secondary: {
      main: '#fff',
      contrastText: '#23272f',
    },
    background: {
      default: '#fff',
      paper: '#fff',
    },
    success: {
      main: '#388e3c',
    },
    error: {
      main: '#ff1744',
    },
    info: {
      main: '#2979ff',
    },
    warning: {
      main: '#ffc400',
    },
    text: {
      primary: '#23272f',
      secondary: '#4f4f4f',
    },
  },
  shape: {
    borderRadius: 24,
  },
  typography: {
    fontFamily: 'Montserrat, Arial, sans-serif',
    h4: {
      fontWeight: 900,
      letterSpacing: '-0.02em',
      fontSize: '2.5rem',
    },
    h6: {
      fontWeight: 700,
      fontSize: '1.25rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
      fontSize: '1rem',
    },
    body1: {
      fontWeight: 400,
      fontSize: '1.1rem',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 32px 0 rgba(0,0,0,0.10)',
          borderRadius: 24,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          boxShadow: '0 8px 32px 0 rgba(0,255,174,0.10)',
          background: '#fff',
          color: '#23272f',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          fontWeight: 700,
        },
      },
    },
  },
});



const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<Summary>({ totalIncome: 0, totalExpenses: 0, balance: 0 });
  const [loading, setLoading] = useState<boolean>(true);
const [editOpen, setEditOpen] = useState(false);
const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
const [editSaving, setEditSaving] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [transactionsData, summaryData] = await Promise.all([
        getTransactions(),
        getSummary(),
      ]);
      setTransactions(transactionsData);
      setSummary(summaryData);
      console.log('Fetched transactions:', transactionsData);
      console.log('Fetched summary:', summaryData);
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

  const handleEditClick = (transaction: Transaction) => {
  setEditTransaction(transaction);
  setEditOpen(true);
};

const handleEditSave = async (data: Omit<TransactionFormData, 'id'>) => {
  if (editTransaction) {
    setEditSaving(true);
    try {
      await apiUpdateTransaction(editTransaction.id, data);
      await fetchData();
      console.log('State after edit:', transactions);
      setEditOpen(false);
      setEditTransaction(null);
    } catch (error) {
      console.error('Error updating transaction:', error);
    } finally {
      setEditSaving(false);
    }
  }
};

const handleEditCancel = () => {
  setEditOpen(false);
  setEditTransaction(null);
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
            onEdit={handleEditClick}
          />
          <Dialog open={editOpen} onClose={handleEditCancel} maxWidth="sm" fullWidth>
            <DialogTitle>Edit Transaction</DialogTitle>
            {editTransaction && (
              <TransactionForm
                initialValues={{
                  description: editTransaction.description,
                  amount: String(editTransaction.amount),
                  type: editTransaction.type,
                  category: editTransaction.category,
                }}
                onSubmit={handleEditSave}
                onCancel={handleEditCancel}
                submitLabel="Save Changes"
                submitLoading={editSaving}
              />
            )}
          </Dialog>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App;
