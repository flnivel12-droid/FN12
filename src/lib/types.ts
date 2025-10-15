export interface Transaction {
  id: string;
  amount: number;
  date: string;
  type: 'income' | 'expense' | 'investment';
  category: string;
  description?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  monthlyLivingCost: number;
  financialReserve: number;
  monthlySpendingLimit: number;
  subscriptionStatus: 'trial' | 'active' | 'expired';
  trialEndDate: string;
}

export interface FinancialData {
  currentBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  totalInvestments: number;
  fortressLevel: number;
  transactions: Transaction[];
}

export interface InvestmentType {
  id: string;
  name: string;
  amount: number;
  type: 'stocks' | 'fixed_income' | 'real_estate' | 'others';
  date: string;
}

export interface ExpenseCategory {
  name: string;
  amount: number;
  percentage: number;
  color: string;
}