import { createClient } from '@supabase/supabase-js'

// Configuração com fallbacks seguros para build
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Cliente Supabase com configuração otimizada para build e confirmação de email
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Evita problemas de sessão durante build
    autoRefreshToken: false, // Desabilita refresh automático durante build
    // URL de redirecionamento para confirmação de email
    redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined
  }
})

// Função para verificar se o Supabase está configurado
export const isSupabaseConfigured = (): boolean => {
  // Durante build, sempre retorna false para evitar chamadas de API
  if (typeof window === 'undefined') {
    return false
  }
  
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co' &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'placeholder-key'
  )
}

// Tipos para o banco de dados
export interface DatabaseUser {
  id: string
  email: string
  name: string
  monthly_living_cost: number
  financial_reserve: number
  monthly_spending_limit: number
  subscription_status: 'trial' | 'active' | 'expired'
  trial_end_date: string
  created_at: string
  updated_at: string
}

export interface DatabaseTransaction {
  id: string
  user_id: string
  amount: number
  date: string
  type: 'income' | 'expense' | 'investment'
  category: string
  description?: string
  created_at: string
}