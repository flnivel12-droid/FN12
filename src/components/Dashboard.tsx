"use client";

import { TrendingUp, TrendingDown, DollarSign, Target, Shield, AlertTriangle } from 'lucide-react';
import { FinancialData, User, Transaction } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface DashboardProps {
  financialData: FinancialData;
  user: User;
  transactions: Transaction[];
}

export const Dashboard = ({ financialData, user, transactions }: DashboardProps) => {
  const currentMonth = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const monthlyBalance = financialData.monthlyIncome - financialData.monthlyExpenses;
  const isOverBudget = financialData.monthlyExpenses > user.monthlySpendingLimit;
  
  // Calcular progresso para o próximo nível
  const currentLevel = financialData.fortressLevel;
  const nextLevel = Math.floor(currentLevel) + 1;
  const progressToNextLevel = ((currentLevel % 1) * 100);

  return (
    <div className="space-y-6">
      {/* Header com nível */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl p-6 text-black">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Nível {Math.floor(currentLevel)}</h2>
            <p className="text-black/80">Fortaleza Financeira</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{progressToNextLevel.toFixed(1)}%</div>
            <div className="text-sm text-black/80">para Nível {nextLevel}</div>
          </div>
        </div>
        
        {/* Barra de progresso */}
        <div className="mt-4">
          <div className="bg-black/20 rounded-full h-3">
            <div 
              className="bg-black rounded-full h-3 transition-all duration-500"
              style={{ width: `${progressToNextLevel}%` }}
            />
          </div>
        </div>
      </div>

      {/* Alerta de orçamento */}
      {isOverBudget && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center space-x-3">
          <AlertTriangle className="w-6 h-6 text-red-600" />
          <div>
            <h3 className="font-semibold text-red-800">Orçamento Ultrapassado!</h3>
            <p className="text-red-600 text-sm">
              Você gastou {formatCurrency(financialData.monthlyExpenses - user.monthlySpendingLimit)} 
              acima do seu limite mensal.
            </p>
          </div>
        </div>
      )}

      {/* Cards de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Saldo Atual</p>
              <p className={`text-2xl font-bold ${financialData.currentBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(financialData.currentBalance)}
              </p>
            </div>
            <div className={`p-3 rounded-xl ${financialData.currentBalance >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
              <DollarSign className={`w-6 h-6 ${financialData.currentBalance >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Receitas ({currentMonth})</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(financialData.monthlyIncome)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Gastos ({currentMonth})</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(financialData.monthlyExpenses)}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-xl">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Investimentos</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(financialData.totalInvestments)}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Resumo mensal */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo de {currentMonth}</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total de Receitas</span>
            <span className="font-semibold text-green-600">
              {formatCurrency(financialData.monthlyIncome)}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total de Gastos</span>
            <span className="font-semibold text-red-600">
              {formatCurrency(financialData.monthlyExpenses)}
            </span>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900">Saldo do Mês</span>
              <span className={`font-bold text-lg ${monthlyBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(monthlyBalance)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Transações recentes */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Transações Recentes</h3>
        
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Shield className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Nenhuma transação registrada ainda.</p>
            <p className="text-sm">Comece adicionando suas receitas e gastos!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.slice(-5).reverse().map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    transaction.type === 'income' ? 'bg-green-100' :
                    transaction.type === 'expense' ? 'bg-red-100' : 'bg-blue-100'
                  }`}>
                    {transaction.type === 'income' ? (
                      <TrendingUp className={`w-4 h-4 ${
                        transaction.type === 'income' ? 'text-green-600' :
                        transaction.type === 'expense' ? 'text-red-600' : 'text-blue-600'
                      }`} />
                    ) : transaction.type === 'expense' ? (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    ) : (
                      <Target className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.category}</p>
                    <p className="text-sm text-gray-500">{transaction.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.type === 'income' ? 'text-green-600' :
                    transaction.type === 'expense' ? 'text-red-600' : 'text-blue-600'
                  }`}>
                    {transaction.type === 'expense' ? '-' : '+'}{formatCurrency(transaction.amount)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};