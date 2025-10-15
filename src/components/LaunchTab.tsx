"use client";

import { useState } from 'react';
import { Plus, Trash2, PieChart, TrendingUp, TrendingDown } from 'lucide-react';
import { Transaction } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface LaunchTabProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
}

export const LaunchTab = ({ onAddTransaction, transactions, onDeleteTransaction }: LaunchTabProps) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'income' | 'expense' | 'investment'>('income');
  const [category, setCategory] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description || !category) return;

    onAddTransaction({
      type,
      amount: parseFloat(amount),
      description,
      category,
      date: new Date().toISOString(),
    });

    setAmount('');
    setDescription('');
    setCategory('');
  };

  const recentTransactions = transactions.slice(-10).reverse();
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const totalInvestments = transactions.filter(t => t.type === 'investment').reduce((sum, t) => sum + t.amount, 0);

  const getCategoryOptions = () => {
    switch (type) {
      case 'income':
        return ['Salário', 'Freelance', 'Investimentos', 'Vendas', 'Outros'];
      case 'expense':
        return ['Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Entretenimento', 'Outros'];
      case 'investment':
        return ['Ações', 'Fundos', 'Criptomoedas', 'Imóveis', 'Poupança', 'Outros'];
      default:
        return [];
    }
  };

  const getTypeColor = (transactionType: string) => {
    switch (transactionType) {
      case 'income':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'expense':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'investment':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (transactionType: string) => {
    switch (transactionType) {
      case 'income':
        return <TrendingUp className="w-4 h-4" />;
      case 'expense':
        return <TrendingDown className="w-4 h-4" />;
      case 'investment':
        return <PieChart className="w-4 h-4" />;
      default:
        return <PieChart className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Lançamentos</h2>
        <p className="text-purple-100">Registre todas suas movimentações financeiras</p>
      </div>

      {/* Resumo Financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Entradas</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Gastos</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-xl">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Investimentos</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalInvestments)}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <PieChart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Formulário de Lançamento */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Novo Lançamento</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo
              </label>
              <select
                value={type}
                onChange={(e) => {
                  setType(e.target.value as 'income' | 'expense' | 'investment');
                  setCategory('');
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="income">Entrada</option>
                <option value="expense">Gasto</option>
                <option value="investment">Investimento</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor (US$)
              </label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="">Selecione uma categoria</option>
                {getCategoryOptions().map((cat) => (
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
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Descreva a movimentação..."
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300"
          >
            <Plus className="w-5 h-5 inline mr-2" />
            Adicionar Lançamento
          </button>
        </form>
      </div>

      {/* Lista de Transações Recentes */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Lançamentos Recentes</h3>
        
        {recentTransactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <PieChart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhum lançamento registrado ainda</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className={`flex items-center justify-between p-4 rounded-xl border ${getTypeColor(transaction.type)}`}>
                <div className="flex items-center space-x-3">
                  {getTypeIcon(transaction.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{transaction.description}</h4>
                      <span className={`font-semibold ${
                        transaction.type === 'income' ? 'text-green-600' : 
                        transaction.type === 'expense' ? 'text-red-600' : 'text-blue-600'
                      }`}>
                        {transaction.type === 'expense' ? '-' : '+'}{formatCurrency(transaction.amount)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm text-gray-500">{transaction.category}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(transaction.date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onDeleteTransaction(transaction.id)}
                  className="ml-4 text-gray-500 hover:text-red-600 transition-colors"
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