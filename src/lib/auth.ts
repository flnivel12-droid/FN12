import { supabase, isSupabaseConfigured } from './supabase'

export interface RegisterData {
  name: string
  email: string
  password: string
}

export interface LoginData {
  email: string
  password: string
}

export interface UserProfile {
  id: string
  email: string
  name: string
  monthlyLivingCost: number
  financialReserve: number
  monthlySpendingLimit: number
  subscriptionStatus: 'trial' | 'active' | 'expired'
  trialEndDate: string
  emailConfirmed: boolean
}

// Função para registrar usuário com confirmação de email
export async function registerUser(data: RegisterData): Promise<{ success: boolean; user?: UserProfile; error?: string; needsEmailConfirmation?: boolean }> {
  try {
    // Verificar se o Supabase está configurado
    if (!isSupabaseConfigured()) {
      return { 
        success: false, 
        error: 'Banco de dados não configurado. Configure o Supabase nas configurações do projeto.' 
      }
    }

    // Usar Supabase Auth para registro com confirmação de email
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name
        }
      }
    })

    if (authError) {
      if (authError.message.includes('already registered')) {
        return { success: false, error: 'E-mail já cadastrado' }
      }
      return { success: false, error: authError.message }
    }

    if (!authData.user) {
      return { success: false, error: 'Erro ao criar conta' }
    }

    // Tentar criar perfil do usuário na tabela personalizada
    try {
      await supabase
        .from('user_profiles')
        .insert({
          id: authData.user.id,
          name: data.name,
          email: data.email,
          monthly_living_cost: 0,
          financial_reserve: 0,
          monthly_spending_limit: 0,
          subscription_status: 'trial',
          trial_end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        })
    } catch (profileError) {
      console.error('Erro ao criar perfil:', profileError)
      // Não retorna erro aqui pois o usuário foi criado no Auth
    }

    // Se o usuário não está confirmado, retorna sucesso mas indica necessidade de confirmação
    if (!authData.user.email_confirmed_at) {
      return { 
        success: true, 
        needsEmailConfirmation: true,
        error: 'Verifique seu email para confirmar a conta antes de fazer login'
      }
    }

    const userProfile: UserProfile = {
      id: authData.user.id,
      email: data.email,
      name: data.name,
      monthlyLivingCost: 0,
      financialReserve: 0,
      monthlySpendingLimit: 0,
      subscriptionStatus: 'trial',
      trialEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      emailConfirmed: !!authData.user.email_confirmed_at
    }

    return { success: true, user: userProfile }
  } catch (error) {
    console.error('Erro no registro:', error)
    return { success: false, error: 'Erro interno do servidor' }
  }
}

// Função para fazer login (apenas usuários confirmados)
export async function loginUser(data: LoginData): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  try {
    // Verificar se o Supabase está configurado
    if (!isSupabaseConfigured()) {
      return { 
        success: false, 
        error: 'Banco de dados não configurado. Configure o Supabase nas configurações do projeto.' 
      }
    }

    // Usar Supabase Auth para login
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password
    })

    if (authError) {
      if (authError.message.includes('Invalid login credentials')) {
        return { success: false, error: 'E-mail ou senha incorretos' }
      }
      if (authError.message.includes('Email not confirmed')) {
        return { success: false, error: 'Confirme seu email antes de fazer login. Verifique sua caixa de entrada.' }
      }
      return { success: false, error: authError.message }
    }

    if (!authData.user) {
      return { success: false, error: 'Erro ao fazer login' }
    }

    // Verificar se o email foi confirmado
    if (!authData.user.email_confirmed_at) {
      return { 
        success: false, 
        error: 'Confirme seu email antes de fazer login. Verifique sua caixa de entrada e clique no link de confirmação.' 
      }
    }

    // Buscar perfil do usuário com tratamento de erro
    let profile = null
    try {
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single()
      
      profile = profileData
    } catch (profileError) {
      console.error('Erro ao buscar perfil:', profileError)
    }

    if (!profile) {
      // Se não encontrar o perfil, criar um básico
      try {
        const { data: newProfile } = await supabase
          .from('user_profiles')
          .insert({
            id: authData.user.id,
            name: authData.user.user_metadata?.name || 'Usuário',
            email: authData.user.email!,
            monthly_living_cost: 0,
            financial_reserve: 0,
            monthly_spending_limit: 0,
            subscription_status: 'trial',
            trial_end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          })
          .select()
          .single()

        profile = newProfile
      } catch (insertError) {
        console.error('Erro ao criar perfil:', insertError)
        // Usar dados básicos do auth se falhar
        profile = {
          id: authData.user.id,
          name: authData.user.user_metadata?.name || 'Usuário',
          email: authData.user.email!,
          monthly_living_cost: 0,
          financial_reserve: 0,
          monthly_spending_limit: 0,
          subscription_status: 'trial',
          trial_end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        }
      }
    }

    const userProfile: UserProfile = {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      monthlyLivingCost: profile.monthly_living_cost || 0,
      financialReserve: profile.financial_reserve || 0,
      monthlySpendingLimit: profile.monthly_spending_limit || 0,
      subscriptionStatus: profile.subscription_status,
      trialEndDate: profile.trial_end_date,
      emailConfirmed: true
    }

    return { success: true, user: userProfile }
  } catch (error) {
    console.error('Erro no login:', error)
    return { success: false, error: 'Erro interno do servidor' }
  }
}

// Função para reenviar email de confirmação
export async function resendConfirmationEmail(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Banco de dados não configurado' }
    }

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email
    })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Erro ao reenviar email:', error)
    return { success: false, error: 'Erro interno do servidor' }
  }
}

// Função para fazer logout
export async function logoutUser(): Promise<{ success: boolean; error?: string }> {
  try {
    if (!isSupabaseConfigured()) {
      return { success: true } // Logout local se não configurado
    }

    const { error } = await supabase.auth.signOut()
    
    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Erro no logout:', error)
    return { success: false, error: 'Erro interno do servidor' }
  }
}

// Função para atualizar perfil do usuário
export async function updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<{ success: boolean; error?: string }> {
  try {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Banco de dados não configurado' }
    }

    const { error } = await supabase
      .from('user_profiles')
      .update({
        name: updates.name,
        monthly_living_cost: updates.monthlyLivingCost,
        financial_reserve: updates.financialReserve,
        monthly_spending_limit: updates.monthlySpendingLimit,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (error) {
      console.error('Erro ao atualizar perfil:', error)
      return { success: false, error: 'Erro ao atualizar perfil' }
    }

    return { success: true }
  } catch (error) {
    console.error('Erro na atualização:', error)
    return { success: false, error: 'Erro interno do servidor' }
  }
}