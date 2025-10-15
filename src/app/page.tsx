"use client";

import { useState, useEffect } from 'react';
import { 
  Home, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  Users,
  Bot,
  Phone,
  Settings,
  Loader2,
  Mail,
  CheckCircle,
  X,
} from 'lucide-react';
import { registerUser, loginUser, resendConfirmationEmail, logoutUser, UserProfile } from '@/lib/auth';

// Tipos básicos
interface Transaction {
  id: string;
  amount: number;
  date: string;
  type: 'income' | 'expense' | 'investment';
  category: string;
  description?: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  monthlyLivingCost: number;
  financialReserve: number;
  monthlySpendingLimit: number;
  subscriptionStatus: 'trial' | 'active' | 'expired';
  trialEndDate: string;
}

interface AuthUser {
  id: string;
  email: string;
  name: string;
  hasPaymentMethod: boolean;
  subscriptionStatus: 'trial' | 'active' | 'expired';
  trialEndDate: string;
}

// Utilitários básicos
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

const calculateFortressLevel = (financialReserve: number, monthlyLivingCost: number): number => {
  if (monthlyLivingCost === 0) return 0;
  return Math.floor(financialReserve / monthlyLivingCost);
};

// Componente de Notificação
const Notification = ({ 
  type, 
  message, 
  onClose 
}: { 
  type: 'success' | 'error'; 
  message: string; 
  onClose: () => void; 
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-md p-4 rounded-xl border backdrop-blur-sm ${
      type === 'success' 
        ? 'bg-green-500/10 border-green-500/20 text-green-400' 
        : 'bg-red-500/10 border-red-500/20 text-red-400'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          {type === 'success' ? (
            <CheckCircle className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
          ) : (
            <X className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
          )}
          <p className="text-sm">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-3 text-gray-400 hover:text-gray-300"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Componente de Confirmação de Email
const EmailConfirmationScreen = ({ 
  email, 
  onBackToLogin, 
  onResendEmail 
}: { 
  email: string; 
  onBackToLogin: () => void;
  onResendEmail: (email: string) => void;
}) => {
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  const handleResend = async () => {
    setIsResending(true);
    setResendMessage('');
    
    try {
      await onResendEmail(email);
      setResendMessage('Email de confirmação reenviado! Verifique sua caixa de entrada.');
    } catch (error) {
      setResendMessage('Erro ao reenviar email. Tente novamente.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-black/20 backdrop-blur-sm rounded-3xl p-8 border border-yellow-500/20">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-yellow-400 rounded-full flex items-center justify-center">
            <Mail className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Confirme seu Email</h1>
          <p className="text-gray-300">Enviamos um link de confirmação para:</p>
          <p className="text-yellow-400 font-medium mt-2">{email}</p>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6">
          <div className="flex items-start">
            <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
            <div className="text-sm text-blue-300">
              <p className="font-medium mb-1">Próximos passos:</p>
              <ol className="list-decimal list-inside space-y-1 text-blue-200">
                <li>Verifique sua caixa de entrada</li>
                <li>Clique no link de confirmação</li>
                <li>Volte aqui e faça login</li>
              </ol>
            </div>
          </div>
        </div>

        {resendMessage && (
          <div className={`mb-6 p-4 rounded-xl ${
            resendMessage.includes('Erro') 
              ? 'bg-red-500/10 border border-red-500/20' 
              : 'bg-green-500/10 border border-green-500/20'
          }`}>
            <p className={`text-sm ${
              resendMessage.includes('Erro') ? 'text-red-400' : 'text-green-400'
            }`}>
              {resendMessage}
            </p>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleResend}
            disabled={isResending}
            className="w-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 font-medium py-3 px-6 rounded-xl hover:bg-yellow-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isResending ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Reenviando...
              </>
            ) : (
              <>
                <Mail className="w-5 h-5 mr-2" />
                Reenviar Email
              </>
            )}
          </button>

          <button
            onClick={onBackToLogin}
            className="w-full bg-gray-500/20 border border-gray-500/30 text-gray-300 font-medium py-3 px-6 rounded-xl hover:bg-gray-500/30 transition-all duration-300"
          >
            Voltar ao Login
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Não recebeu o email? Verifique sua pasta de spam ou lixo eletrônico.
          </p>
        </div>
      </div>
    </div>
  );
};

// Componente de Login (SEM usuário teste)
const LoginScreen = ({ 
  onLogin, 
  onSwitchToRegister,
  notification,
  onCloseNotification
}: { 
  onLogin: (user: AuthUser) => void; 
  onSwitchToRegister: () => void;
  notification?: { type: 'success' | 'error'; message: string };
  onCloseNotification?: () => void;
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await loginUser({ email, password });
      
      if (result.success && result.user) {
        onLogin({
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          hasPaymentMethod: false,
          subscriptionStatus: result.user.subscriptionStatus,
          trialEndDate: result.user.trialEndDate,
        });
      } else {
        setError(result.error || 'Erro ao fazer login');
      }
    } catch (err) {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {notification && onCloseNotification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={onCloseNotification}
        />
      )}

      <div className="max-w-md w-full bg-black/20 backdrop-blur-sm rounded-3xl p-8 border border-yellow-500/20">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-black rounded-full flex items-center justify-center">
            <img 
              src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/697b1ec8-c3c1-4b8f-8581-20f9ddaab055.png" 
              alt="Logo NI FN 12" 
              className="w-16 h-16 rounded-full object-cover"
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Fortaleza Nível 12</h1>
          <p className="text-gray-300">Entre na sua conta</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="seu@email.com"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="Sua senha"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold py-3 px-6 rounded-xl hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Não tem uma conta?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-yellow-400 hover:text-yellow-300 font-medium"
              disabled={loading}
            >
              Cadastre-se
            </button>
          </p>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            ⚠️ Apenas usuários cadastrados podem fazer login
          </p>
        </div>
      </div>
    </div>
  );
};

// Componente de Registro com Confirmação de Email
const RegisterScreen = ({ 
  onRegister, 
  onSwitchToLogin, 
  onEmailConfirmation 
}: { 
  onRegister: (user: AuthUser) => void; 
  onSwitchToLogin: () => void;
  onEmailConfirmation: (email: string) => void;
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const result = await registerUser({ name, email, password });
      
      if (result.success) {
        if (result.needsEmailConfirmation) {
          // Redirecionar para tela de confirmação de email
          onEmailConfirmation(email);
        } else if (result.user) {
          // Login automático se não precisar de confirmação
          onRegister({
            id: result.user.id,
            email: result.user.email,
            name: result.user.name,
            hasPaymentMethod: false,
            subscriptionStatus: result.user.subscriptionStatus,
            trialEndDate: result.user.trialEndDate,
          });
        }
      } else {
        setError(result.error || 'Erro ao criar conta');
      }
    } catch (err) {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-black/20 backdrop-blur-sm rounded-3xl p-8 border border-yellow-500/20">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-black rounded-full flex items-center justify-center">
            <img 
              src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/697b1ec8-c3c1-4b8f-8581-20f9ddaab055.png" 
              alt="Logo NI FN 12" 
              className="w-16 h-16 rounded-full object-cover"
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Fortaleza Nível 12</h1>
          <p className="text-gray-300">Crie sua conta</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="Seu nome"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="seu@email.com"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="Sua senha (mín. 6 caracteres)"
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold py-3 px-6 rounded-xl hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Criando conta...
              </>
            ) : (
              'Cadastrar'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Já tem uma conta?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-yellow-400 hover:text-yellow-300 font-medium"
              disabled={loading}
            >
              Entrar
            </button>
          </p>
        </div>

        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
          <p className="text-xs text-blue-300 text-center">
            📧 Após o cadastro, você receberá um email de confirmação
          </p>
        </div>
      </div>
    </div>
  );
};

// Dashboard Simples
const Dashboard = ({ user, transactions }: { user: User; transactions: Transaction[] }) => {
  const monthlyIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const monthlyExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const currentBalance = monthlyIncome - monthlyExpenses;
  const fortressLevel = calculateFortressLevel(user.financialReserve + currentBalance, user.monthlyLivingCost);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl p-6 text-black">
        <h2 className="text-2xl font-bold mb-2">Dashboard Financeiro</h2>
        <p className="text-black/80">Bem-vindo ao seu painel de controle financeiro, {user.name}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Nível da Fortaleza</h3>
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <Home className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-yellow-600">{fortressLevel}</p>
          <p className="text-sm text-gray-500">de 12 meses</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Saldo Atual</h3>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-green-600">{formatCurrency(currentBalance)}</p>
          <p className="text-sm text-gray-500">Este mês</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Receitas</h3>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-blue-600">{formatCurrency(monthlyIncome)}</p>
          <p className="text-sm text-gray-500">Este mês</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Gastos</h3>
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-red-600">{formatCurrency(monthlyExpenses)}</p>
          <p className="text-sm text-gray-500">Este mês</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Transações Recentes</h3>
        {transactions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Nenhuma transação encontrada</p>
        ) : (
          <div className="space-y-3">
            {transactions.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === 'income' ? 'bg-green-100' : 
                    transaction.type === 'expense' ? 'bg-red-100' : 'bg-blue-100'
                  }`}>
                    {transaction.type === 'income' ? (
                      <TrendingUp className={`w-5 h-5 ${
                        transaction.type === 'income' ? 'text-green-600' : 
                        transaction.type === 'expense' ? 'text-red-600' : 'text-blue-600'
                      }`} />
                    ) : transaction.type === 'expense' ? (
                      <TrendingDown className="w-5 h-5 text-red-600" />
                    ) : (
                      <PieChart className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">{transaction.category}</p>
                    <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <p className={`font-semibold ${
                  transaction.type === 'income' ? 'text-green-600' : 
                  transaction.type === 'expense' ? 'text-red-600' : 'text-blue-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Componente Principal
export default function FortalezaNivel12() {
  const [authState, setAuthState] = useState<'login' | 'register' | 'email-confirmation' | 'app'>('login');
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [pendingEmail, setPendingEmail] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [transactions] = useState<Transaction[]>([]);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [user, setUser] = useState<User>({
    id: '1',
    email: 'user@example.com',
    name: 'Usuário',
    monthlyLivingCost: 3000,
    financialReserve: 15000,
    monthlySpendingLimit: 2500,
    subscriptionStatus: 'trial',
    trialEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  });

  // Verificar parâmetros da URL para mensagens de confirmação
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const confirmed = urlParams.get('confirmed');
      const message = urlParams.get('message');
      const error = urlParams.get('error');

      if (confirmed === 'true' && message) {
        setNotification({ type: 'success', message: decodeURIComponent(message) });
        // Limpar parâmetros da URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (error) {
        setNotification({ type: 'error', message: decodeURIComponent(error) });
        // Limpar parâmetros da URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  const handleLogin = (user: AuthUser) => {
    setAuthUser(user);
    setUser(prev => ({ 
      ...prev, 
      id: user.id,
      email: user.email, 
      name: user.name,
      subscriptionStatus: user.subscriptionStatus,
      trialEndDate: user.trialEndDate
    }));
    setAuthState('app');
  };

  const handleRegister = (user: AuthUser) => {
    setAuthUser(user);
    setUser(prev => ({ 
      ...prev, 
      id: user.id,
      email: user.email, 
      name: user.name,
      subscriptionStatus: user.subscriptionStatus,
      trialEndDate: user.trialEndDate
    }));
    setAuthState('app');
  };

  const handleEmailConfirmation = (email: string) => {
    setPendingEmail(email);
    setAuthState('email-confirmation');
  };

  const handleResendEmail = async (email: string) => {
    await resendConfirmationEmail(email);
  };

  const handleLogout = async () => {
    await logoutUser();
    setAuthState('login');
    setAuthUser(null);
    setPendingEmail('');
  };

  const handleCloseNotification = () => {
    setNotification(null);
  };

  // Renderização condicional baseada no estado de autenticação
  if (authState === 'login') {
    return (
      <LoginScreen 
        onLogin={handleLogin}
        onSwitchToRegister={() => setAuthState('register')}
        notification={notification || undefined}
        onCloseNotification={notification ? handleCloseNotification : undefined}
      />
    );
  }

  if (authState === 'register') {
    return (
      <RegisterScreen 
        onRegister={handleRegister}
        onSwitchToLogin={() => setAuthState('login')}
        onEmailConfirmation={handleEmailConfirmation}
      />
    );
  }

  if (authState === 'email-confirmation') {
    return (
      <EmailConfirmationScreen
        email={pendingEmail}
        onBackToLogin={() => setAuthState('login')}
        onResendEmail={handleResendEmail}
      />
    );
  }

  // App principal
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'income', label: 'Entradas', icon: TrendingUp },
    { id: 'expenses', label: 'Gastos', icon: TrendingDown },
    { id: 'launch', label: 'Lançamentos', icon: PieChart },
    { id: 'referral', label: 'Indicações', icon: Users },
    { id: 'ai-chat', label: 'Assistente IA', icon: Bot },
    { id: 'mentorship', label: 'Mentoria', icon: Phone },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-black border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center mr-3 border border-yellow-500/20">
                <img 
                  src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/697b1ec8-c3c1-4b8f-8581-20f9ddaab055.png" 
                  alt="Logo NI FN 12" 
                  className="w-6 h-6 rounded object-cover"
                />
              </div>
              <h1 className="text-xl font-bold text-white">Fortaleza Nível 12</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">Nível {calculateFortressLevel(user.financialReserve, user.monthlyLivingCost)}</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">{authUser?.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-400 hover:text-red-300"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="bg-black rounded-2xl p-4 border border-gray-800">
              <div className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 ${
                        activeTab === item.id
                          ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black'
                          : 'text-gray-300 hover:bg-gray-800'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'dashboard' && <Dashboard user={user} transactions={transactions} />}
            {activeTab !== 'dashboard' && (
              <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Em Desenvolvimento</h2>
                <p className="text-gray-600">Esta funcionalidade estará disponível em breve!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}