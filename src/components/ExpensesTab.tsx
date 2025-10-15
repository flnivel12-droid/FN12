"use client";

import { useState } from 'react';
import { Plus, Trash2, TrendingDown } from 'lucide-react';
import { Transaction } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface ExpensesTabProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  customCategories: { income: string[]; expense: string[] };
  onAddCategory: (type: 'income' | 'expense', category: string) => void;
}

const defaultExpenseCategories = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Saúde',
  'Educação',
  'Entretenimento',
  'Roupas',
  'Outros'
];

export const ExpensesTab = ({ 
  onAddTransaction, 
  transactions, 
  onDeleteTransaction,
  customCategories,
  onAddCategory 
}: ExpensesTabProps) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');

  const expenseCategories = [...defaultExpenseCategories, ...customCategories.expense];
  const expenseTransactions = transactions.filter(t => t.type === 'expense');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description || !category) return;

    onAddTransaction({
      type: 'expense',
      amount: parseFloat(amount),
      description,
      category,
      date: new Date().toISOString(),
    });

    setAmount('');
    setDescription('');
    setCategory('');
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      onAddCategory('expense', newCategory.trim());
      setNewCategory('');
    }
  };

  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Gastos</h2>
        <p className="text-red-100">Controle seus gastos para manter sua fortaleza financeira</p>
        <div className="mt-4">
          <p className="text-red-100">Total de gastos este mês:</p>
          <p className="text-3xl font-bold">{formatCurrency(totalExpenses)}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Adicionar Gasto</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor (US$)
              </label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              >
                <option value="">Selecione uma categoria</option>
                {expenseCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Descreva o gasto..."
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold py-3 px-6 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300"
          >
            <Plus className="w-5 h-5 inline mr-2" />
            Adicionar Gasto
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-md font-medium text-gray-900 mb-3">Adicionar Nova Categoria</h4>
          <div className="flex space-x-2">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Nome da nova categoria..."
            />
            <button
              onClick={handleAddCategory}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Gastos Recentes</h3>
        
        {expenseTransactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <TrendingDown className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhum gasto registrado ainda</p>
          </div>
        ) : (
          <div className="space-y-3">
            {expenseTransactions.slice(0, 10).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">{transaction.description}</h4>
                    <span className="text-red-600 font-semibold">{formatCurrency(transaction.amount)}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-gray-500">{transaction.category}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onDeleteTransaction(transaction.id)}
                  className="ml-4 text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};