"use client";

import { useState } from 'react';
import { Plus, TrendingUp, Trash2 } from 'lucide-react';
import { Transaction } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface IncomeTabProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  customCategories: { income: string[]; expense: string[] };
  onAddCategory: (type: 'income' | 'expense', category: string) => void;
}

const defaultIncomeCategories = [
  'Salário',
  'Freelance',
  'Investimentos',
  'Vendas',
  'Aluguel',
  'Dividendos',
  'Bonificação',
  'Outros'
];

export const IncomeTab = ({ 
  onAddTransaction, 
  transactions, 
  onDeleteTransaction,
  customCategories,
  onAddCategory 
}: IncomeTabProps) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Salário');
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);

  const allCategories = [...defaultIncomeCategories, ...customCategories.income];
  const incomeTransactions = transactions.filter(t => t.type === 'income');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    onAddTransaction({
      type: 'income',
      amount: parseFloat(amount),
      description,
      category,
      date: new Date().toISOString(),
    });

    setAmount('');
    setDescription('');
    setCategory('Salário');
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !allCategories.includes(newCategory.trim())) {
      onAddCategory('income', newCategory.trim());
      setCategory(newCategory.trim());
      setNewCategory('');
      setShowNewCategory(false);
    }
  };

  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      <div className="bg-black rounded-2xl p-6 border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-green-400" />
            Entradas
          </h2>
          <div className="text-right">
            <p className="text-sm text-gray-400">Total do Mês</p>
            <p className="text-2xl font-bold text-green-400">{formatCurrency(totalIncome)}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Valor</label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="0,00"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Categoria</label>
              <div className="flex gap-2">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {allCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowNewCategory(!showNewCategory)}
                  className="px-3 py-3 bg-gray-700 border border-gray-600 rounded-xl text-gray-300 hover:bg-gray-600"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {showNewCategory && (
            <div className="flex gap-2">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Nova categoria"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700"
              >
                Adicionar
              </button>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Descrição</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Descrição da entrada"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105"
          >
            Adicionar Entrada
          </button>
        </form>
      </div>

      {/* Lista de transações */}
      <div className="bg-black rounded-2xl p-6 border border-gray-800">
        <h3 className="text-xl font-bold text-white mb-4">Entradas Recentes</h3>
        <div className="space-y-3">
          {incomeTransactions.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Nenhuma entrada registrada ainda</p>
          ) : (
            incomeTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-xl">
                <div>
                  <p className="text-white font-medium">{transaction.description}</p>
                  <p className="text-sm text-gray-400">{transaction.category}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(transaction.date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-400 font-bold">
                    {formatCurrency(transaction.amount)}
                  </span>
                  <button
                    onClick={() => onDeleteTransaction(transaction.id)}
                    className="text-red-400 hover:text-red-300 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};