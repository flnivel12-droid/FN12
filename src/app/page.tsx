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
import { supabase, isSupabaseConfigured, DatabaseUser } from '@/lib/supabase';

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

// Componente de Login com Supabase
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
      if (!isSupabaseConfigured()) {
        // Fallback para demonstração quando Supabase não está configurado
        setTimeout(() => {
          if (email && password) {
            onLogin({
              id: '1',
              email: email,
              name: 'Usuário Demo',
              hasPaymentMethod: false,
              subscriptionStatus: 'trial',
              trialEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            });
          } else {
            setError('Preencha todos os campos');
          }
          setLoading(false);
        }, 1000);
        return;
      }

      // Login real com Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        if (authError.message.includes('Invalid login credentials')) {
          setError('Email ou senha incorretos. Verifique suas credenciais.');
        } else if (authError.message.includes('Email not confirmed')) {
          setError('Por favor, confirme seu email antes de fazer login.');
        } else {
          setError('Erro ao fazer login: ' + authError.message);
        }
        setLoading(false);
        return;
      }

      if (!authData.user) {
        setError('Erro inesperado no login');
        setLoading(false);
        return;
      }

      // Buscar dados do usuário na tabela users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (userError) {
        console.error('Erro ao buscar dados do usuário:', userError);
        // Se não encontrar na tabela users, criar um registro básico
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: authData.user.email || email,
            name: authData.user.user_metadata?.name || 'Usuário',
            monthly_living_cost: 3000,
            financial_reserve: 0,
            monthly_spending_limit: 2500,
            subscription_status: 'trial',
            trial_end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          })
          .select()
          .single();

        if (createError) {
          setError('Erro ao criar perfil do usuário: ' + createError.message);
          setLoading(false);
          return;
        }

        // Usar dados do novo usuário criado
        onLogin({
          id: authData.user.id,
          email: authData.user.email || email,
          name: newUser?.name || 'Usuário',
          hasPaymentMethod: false,
          subscriptionStatus: 'trial',
          trialEndDate: newUser?.trial_end_date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        });
      } else {
        // Usar dados existentes do usuário
        onLogin({
          id: authData.user.id,
          email: authData.user.email || email,
          name: userData.name,
          hasPaymentMethod: false,
          subscriptionStatus: userData.subscription_status,
          trialEndDate: userData.trial_end_date,
        });
      }

    } catch (err) {
      console.error('Erro no login:', err);
      setError('Erro inesperado. Tente novamente.');
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

        {!isSupabaseConfigured() && (
          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <p className="text-xs text-blue-300 text-center">
              💡 Demo: Use qualquer email e senha para testar
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Componente de Registro com Supabase
const RegisterScreen = ({ 
  onRegister, 
  onSwitchToLogin 
}: { 
  onRegister: (user: AuthUser) => void; 
  onSwitchToLogin: () => void;
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
      if (!isSupabaseConfigured()) {
        // Fallback para demonstração quando Supabase não está configurado
        setTimeout(() => {
          if (name && email && password) {
            onRegister({
              id: '1',
              email: email,
              name: name,
              hasPaymentMethod: false,
              subscriptionStatus: 'trial',
              trialEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            });
          } else {
            setError('Preencha todos os campos');
          }
          setLoading(false);
        }, 1000);
        return;
      }

      // Registro real com Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          }
        }
      });

      if (authError) {
        if (authError.message.includes('User already registered')) {
          setError('Este email já está cadastrado. Tente fazer login.');
        } else {
          setError('Erro ao criar conta: ' + authError.message);
        }
        setLoading(false);
        return;
      }

      if (!authData.user) {
        setError('Erro inesperado no cadastro');
        setLoading(false);
        return;
      }

      // Criar registro na tabela users
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: email,
          name: name,
          monthly_living_cost: 3000,
          financial_reserve: 0,
          monthly_spending_limit: 2500,
          subscription_status: 'trial',
          trial_end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        });

      if (userError) {
        console.error('Erro ao criar perfil do usuário:', userError);
        // Mesmo com erro na tabela users, continua com o registro
      }

      // Se o usuário foi criado mas precisa confirmar email
      if (!authData.session) {
        setError('Conta criada! Verifique seu email para confirmar o cadastro antes de fazer login.');
        setLoading(false);
        return;
      }

      // Login automático após registro bem-sucedido
      onRegister({
        id: authData.user.id,
        email: email,
        name: name,
        hasPaymentMethod: false,
        subscriptionStatus: 'trial',
        trialEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      });

    } catch (err) {
      console.error('Erro no registro:', err);
      setError('Erro inesperado. Tente novamente.');
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

        {!isSupabaseConfigured() && (
          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <p className="text-xs text-blue-300 text-center">
              💡 Demo: Funciona offline para demonstração
            </p>
          </div>
        )}
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
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <PieChart className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 mb-2">Nenhuma transação encontrada</p>
          <p className="text-sm text-gray-400">Adicione suas primeiras transações para começar</p>
        </div>
      </div>
    </div>
  );
};

// Componente Principal
export default function FortalezaNivel12() {
  const [authState, setAuthState] = useState<'login' | 'register' | 'app'>('login');
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [transactions] = useState<Transaction[]>([]);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [user, setUser] = useState<User>({
    id: '1',
    email: 'user@example.com',
    name: 'Usuário Demo',
    monthlyLivingCost: 3000,
    financialReserve: 15000,
    monthlySpendingLimit: 2500,
    subscriptionStatus: 'trial',
    trialEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  });

  // Verificar sessão existente ao carregar
  useEffect(() => {
    if (isSupabaseConfigured()) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          // Buscar dados do usuário
          supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()
            .then(({ data: userData }) => {
              if (userData) {
                const authUser: AuthUser = {
                  id: session.user.id,
                  email: session.user.email || '',
                  name: userData.name,
                  hasPaymentMethod: false,
                  subscriptionStatus: userData.subscription_status,
                  trialEndDate: userData.trial_end_date,
                };
                
                setAuthUser(authUser);
                setUser({
                  id: session.user.id,
                  email: session.user.email || '',
                  name: userData.name,
                  monthlyLivingCost: userData.monthly_living_cost,
                  financialReserve: userData.financial_reserve,
                  monthlySpendingLimit: userData.monthly_spending_limit,
                  subscriptionStatus: userData.subscription_status,
                  trialEndDate: userData.trial_end_date,
                });
                setAuthState('app');
              }
            });
        }
      });

      // Escutar mudanças na autenticação
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_OUT') {
          setAuthState('login');
          setAuthUser(null);
        }
      });

      return () => subscription.unsubscribe();
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

  const handleLogout = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setAuthState('login');
    setAuthUser(null);
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