import axios from 'axios';
import { Transaction, Summary, TransactionFormData } from '../types/transaction';

const API_URL = 'http://localhost:5001/api';

export const getTransactions = async (): Promise<Transaction[]> => {
  const response = await axios.get(`${API_URL}/transactions`);
  return response.data;
};

export const addTransaction = async (transaction: Omit<TransactionFormData, 'id'>): Promise<Transaction> => {
  const response = await axios.post(`${API_URL}/transactions`, {
    ...transaction,
    amount: parseFloat(transaction.amount)
  });
  return response.data;
};

export const deleteTransaction = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/transactions/${id}`);
};

export const getSummary = async (): Promise<Summary> => {
  const response = await axios.get(`${API_URL}/summary`);
  return response.data;
};
