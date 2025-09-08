export interface User {
  id: string;
  username: string;
  role: 'admin' | 'normal';
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Type {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  categoryId: string;
  typeId: string;
  amount: number;
  date: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionWithDetails extends Transaction {
  categoryName: string;
  typeName: string;
  userName?: string;
}

export interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  transactionCount: number;
}