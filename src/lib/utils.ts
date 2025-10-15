import { Transaction, ExpenseCategory } from './types';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const calculateFortressLevel = (financialReserve: number, monthlyLivingCost: number): number => {
  if (monthlyLivingCost === 0) return 0;
  return financialReserve / monthlyLivingCost;
};

export const calculateMonthlyTotal = (transactions: Transaction[], type: 'income' | 'expense' | 'investment'): number => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  return transactions
    .filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return (
        transaction.type === type &&
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      );
    })
    .reduce((total, transaction) => total + transaction.amount, 0);
};

export const getExpensesByCategory = (transactions: Transaction[]): ExpenseCategory[] => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const expenses = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return (
      transaction.type === 'expense' &&
      transactionDate.getMonth() === currentMonth &&
      transactionDate.getFullYear() === currentYear
    );
  });

  const categoryTotals: { [key: string]: number } = {};
  expenses.forEach(expense => {
    categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
  });

  const totalExpenses = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);
  
  const colors = ['#FFD700', '#1E40AF', '#000000', '#4B5563', '#F59E0B', '#EF4444'];
  
  return Object.entries(categoryTotals).map(([category, amount], index) => ({
    name: category,
    amount,
    percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
    color: colors[index % colors.length],
  }));
};

export const motivationalQuotes = [
  "A liberdade começa no controle.",
  "Disciplina constrói fortalezas.",
  "Você está mais perto do seu próximo nível.",
  "Cada centavo economizado é um tijolo na sua fortaleza.",
  "O investimento de hoje é a liberdade de amanhã.",
  "Sua mente constrói sua liberdade financeira.",
];

export const getRandomMotivationalQuote = (): string => {
  return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
};

export const calculateIntegratedFinancialReserve = (transactions: Transaction[], baseReserve: number): number => {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalInvestments = transactions
    .filter(t => t.type === 'investment')
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Saldo disponível (receitas - gastos) + investimentos + reserva inicial
  const availableBalance = totalIncome - totalExpenses;
  const totalReserve = baseReserve + availableBalance + totalInvestments;
  
  return Math.max(0, totalReserve); // Nunca negativo
};