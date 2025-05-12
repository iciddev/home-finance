import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TablePagination, CircularProgress, Box, IconButton } from '@mui/material';
import { Transaction } from '../types/transaction';
import DeleteIcon from '@mui/icons-material/Delete';
import { format } from 'date-fns';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: number) => void;
  loading: boolean;
  onEdit: (transaction: Transaction) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete, loading, onEdit }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading && transactions.length === 0) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (transactions.length === 0) {
    return (
      <Typography variant="body1" color="textSecondary" align="center" my={4}>
        No transactions found. Add one to get started!
      </Typography>
    );
  }


  return (
    <Paper elevation={2} sx={{ borderRadius: 8, boxShadow: '0 8px 32px 0 rgba(0,255,174,0.10)', background: '#fff', fontFamily: 'Montserrat, Arial, sans-serif' }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ background: '#388e3c' }}>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Date</TableCell>
              <TableCell sx={{ color: '#23272f', fontWeight: 700 }}>Description</TableCell>
              <TableCell sx={{ color: '#23272f', fontWeight: 700 }}>Category</TableCell>
              <TableCell sx={{ color: '#23272f', fontWeight: 700 }}>Type</TableCell>
              <TableCell align="right" sx={{ color: '#23272f', fontWeight: 700 }}>Amount</TableCell>
              <TableCell align="right" sx={{ color: '#23272f', fontWeight: 700 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((transaction, idx) => (
                <TableRow key={transaction.id} hover sx={{ backgroundColor: idx % 2 === 0 ? '#f7f7f7' : '#ececec', transition: 'background 0.2s' }}>
                  <TableCell>{format(new Date(transaction.date), 'yyyy-MM-dd')}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell>{transaction.type}</TableCell>
                  <TableCell 
                    align="right" 
                    sx={{ 
                      color: transaction.type === 'income' ? 'success.main' : 'error.main',
                      fontWeight: 500 
                    }}
                  >
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => onEdit(transaction)}
                      color="primary"
                      aria-label="edit"
                      sx={{ mr: 1 }}
                    >
                      <span role="img" aria-label="edit">✏️</span>
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => onDelete(transaction.id)}
                      color="error"
                      aria-label="delete"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={transactions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default TransactionList;

