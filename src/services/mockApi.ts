import { User, Category, Type, Transaction, TransactionWithDetails, DashboardStats } from '@/types';

// Mock data storage
const STORAGE_KEYS = {
  USERS: 'wb-finance-users',
  CATEGORIES: 'wb-finance-categories',
  TYPES: 'wb-finance-types',
  TRANSACTIONS: 'wb-finance-transactions'
};

// Initialize default data
const initializeData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const defaultUsers: User[] = [
      {
        id: '1',
        username: 'admin',
        role: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        username: 'user',
        role: 'normal',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
  }

  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    const defaultCategories: Category[] = [
      { id: '1', name: 'Alimentação', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: '2', name: 'Transporte', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: '3', name: 'Salário', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: '4', name: 'Freelance', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    ];
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(defaultCategories));
  }

  if (!localStorage.getItem(STORAGE_KEYS.TYPES)) {
    const defaultTypes: Type[] = [
      { id: '1', name: 'Receita', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: '2', name: 'Despesa', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    ];
    localStorage.setItem(STORAGE_KEYS.TYPES, JSON.stringify(defaultTypes));
  }

  if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify([]));
  }
};

// Initialize data on import
initializeData();

// Generic CRUD operations
const getData = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const saveData = <T>(key: string, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Users API
export const usersApi = {
  getAll: (): User[] => getData<User>(STORAGE_KEYS.USERS),
  
  create: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User => {
    const users = getData<User>(STORAGE_KEYS.USERS);
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    users.push(newUser);
    saveData(STORAGE_KEYS.USERS, users);
    return newUser;
  },

  update: (id: string, userData: Partial<User>): User | null => {
    const users = getData<User>(STORAGE_KEYS.USERS);
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return null;
    
    users[index] = { ...users[index], ...userData, updatedAt: new Date().toISOString() };
    saveData(STORAGE_KEYS.USERS, users);
    return users[index];
  },

  delete: (id: string): boolean => {
    const users = getData<User>(STORAGE_KEYS.USERS);
    const filtered = users.filter(u => u.id !== id);
    if (filtered.length === users.length) return false;
    saveData(STORAGE_KEYS.USERS, filtered);
    return true;
  }
};

// Categories API
export const categoriesApi = {
  getAll: (): Category[] => getData<Category>(STORAGE_KEYS.CATEGORIES),
  
  create: (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Category => {
    const categories = getData<Category>(STORAGE_KEYS.CATEGORIES);
    const newCategory: Category = {
      ...categoryData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    categories.push(newCategory);
    saveData(STORAGE_KEYS.CATEGORIES, categories);
    return newCategory;
  },

  update: (id: string, categoryData: Partial<Category>): Category | null => {
    const categories = getData<Category>(STORAGE_KEYS.CATEGORIES);
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) return null;
    
    categories[index] = { ...categories[index], ...categoryData, updatedAt: new Date().toISOString() };
    saveData(STORAGE_KEYS.CATEGORIES, categories);
    return categories[index];
  },

  delete: (id: string): boolean => {
    const categories = getData<Category>(STORAGE_KEYS.CATEGORIES);
    const filtered = categories.filter(c => c.id !== id);
    if (filtered.length === categories.length) return false;
    saveData(STORAGE_KEYS.CATEGORIES, filtered);
    return true;
  }
};

// Types API
export const typesApi = {
  getAll: (): Type[] => getData<Type>(STORAGE_KEYS.TYPES),
  
  create: (typeData: Omit<Type, 'id' | 'createdAt' | 'updatedAt'>): Type => {
    const types = getData<Type>(STORAGE_KEYS.TYPES);
    const newType: Type = {
      ...typeData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    types.push(newType);
    saveData(STORAGE_KEYS.TYPES, types);
    return newType;
  },

  update: (id: string, typeData: Partial<Type>): Type | null => {
    const types = getData<Type>(STORAGE_KEYS.TYPES);
    const index = types.findIndex(t => t.id === id);
    if (index === -1) return null;
    
    types[index] = { ...types[index], ...typeData, updatedAt: new Date().toISOString() };
    saveData(STORAGE_KEYS.TYPES, types);
    return types[index];
  },

  delete: (id: string): boolean => {
    const types = getData<Type>(STORAGE_KEYS.TYPES);
    const filtered = types.filter(t => t.id !== id);
    if (filtered.length === types.length) return false;
    saveData(STORAGE_KEYS.TYPES, filtered);
    return true;
  }
};

// Transactions API
export const transactionsApi = {
  getAll: (userId?: string, startDate?: string, endDate?: string): TransactionWithDetails[] => {
    const transactions = getData<Transaction>(STORAGE_KEYS.TRANSACTIONS);
    const categories = getData<Category>(STORAGE_KEYS.CATEGORIES);
    const types = getData<Type>(STORAGE_KEYS.TYPES);
    const users = getData<User>(STORAGE_KEYS.USERS);

    let filtered = transactions;
    
    if (userId) {
      filtered = filtered.filter(t => t.userId === userId);
    }
    
    if (startDate) {
      filtered = filtered.filter(t => t.date >= startDate);
    }
    
    if (endDate) {
      filtered = filtered.filter(t => t.date <= endDate);
    }

    return filtered.map(transaction => {
      const category = categories.find(c => c.id === transaction.categoryId);
      const type = types.find(t => t.id === transaction.typeId);
      const user = users.find(u => u.id === transaction.userId);
      
      return {
        ...transaction,
        categoryName: category?.name || 'N/A',
        typeName: type?.name || 'N/A',
        userName: user?.username
      };
    });
  },
  
  create: (transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Transaction => {
    const transactions = getData<Transaction>(STORAGE_KEYS.TRANSACTIONS);
    const newTransaction: Transaction = {
      ...transactionData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    transactions.push(newTransaction);
    saveData(STORAGE_KEYS.TRANSACTIONS, transactions);
    return newTransaction;
  },

  update: (id: string, transactionData: Partial<Transaction>): Transaction | null => {
    const transactions = getData<Transaction>(STORAGE_KEYS.TRANSACTIONS);
    const index = transactions.findIndex(t => t.id === id);
    if (index === -1) return null;
    
    transactions[index] = { ...transactions[index], ...transactionData, updatedAt: new Date().toISOString() };
    saveData(STORAGE_KEYS.TRANSACTIONS, transactions);
    return transactions[index];
  },

  delete: (id: string): boolean => {
    const transactions = getData<Transaction>(STORAGE_KEYS.TRANSACTIONS);
    const filtered = transactions.filter(t => t.id !== id);
    if (filtered.length === transactions.length) return false;
    saveData(STORAGE_KEYS.TRANSACTIONS, filtered);
    return true;
  },

  getStats: (userId?: string, startDate?: string, endDate?: string): DashboardStats => {
    const transactions = transactionsApi.getAll(userId, startDate, endDate);
    
    const income = transactions
      .filter(t => t.typeName.toLowerCase().includes('receita'))
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = transactions
      .filter(t => t.typeName.toLowerCase().includes('despesa'))
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      totalIncome: income,
      totalExpenses: expenses,
      balance: income - expenses,
      transactionCount: transactions.length
    };
  }
};