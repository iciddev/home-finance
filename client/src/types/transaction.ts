export interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
}

export interface Summary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export interface TransactionFormData {
  description: string;
  amount: string;
  type: 'income' | 'expense';
  category: string;
}
