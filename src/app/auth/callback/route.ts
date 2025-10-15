import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const error = requestUrl.searchParams.get('error')
    const errorDescription = requestUrl.searchParams.get('error_description')

    // Se houver erro na confirmação
    if (error) {
      console.error('Erro na confirmação de email:', error, errorDescription)
      return NextResponse.redirect(
        new URL(`/?error=${encodeURIComponent('Erro ao confirmar email. Tente novamente.')}`, request.url)
      )
    }

    // Se não houver código, redirecionar com erro
    if (!code) {
      return NextResponse.redirect(
        new URL(`/?error=${encodeURIComponent('Link de confirmação inválido.')}`, request.url)
      )
    }

    // Configurar cliente Supabase para server-side
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Variáveis de ambiente do Supabase não configuradas')
      return NextResponse.redirect(
        new URL(`/?error=${encodeURIComponent('Configuração do servidor incompleta.')}`, request.url)
      )
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Trocar o código por uma sessão
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error('Erro ao trocar código por sessão:', exchangeError)
      return NextResponse.redirect(
        new URL(`/?error=${encodeURIComponent('Erro ao confirmar email. Tente novamente.')}`, request.url)
      )
    }

    if (!data.user) {
      return NextResponse.redirect(
        new URL(`/?error=${encodeURIComponent('Usuário não encontrado.')}`, request.url)
      )
    }

    // Verificar se o perfil do usuário existe na tabela personalizada
    try {
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()

      // Se o perfil não existir, criar um
      if (profileError || !profile) {
        const trialEndDate = new Date()
        trialEndDate.setDate(trialEndDate.getDate() + 7)
        
        await supabase
          .from('user_profiles')
          .insert({
            id: data.user.id,
            name: data.user.user_metadata?.name || 'Usuário',
            email: data.user.email || '',
            monthly_living_cost: 0,
            financial_reserve: 0,
            monthly_spending_limit: 0,
            subscription_status: 'trial',
            trial_end_date: trialEndDate.toISOString()
          })
      }
    } catch (profileError) {
      console.error('Erro ao verificar/criar perfil:', profileError)
      // Não bloqueia o processo de confirmação
    }

    // Redirecionar para a página principal com sucesso
    return NextResponse.redirect(
      new URL(`/?confirmed=true&message=${encodeURIComponent('Email confirmado com sucesso! Você já pode fazer login.')}`, request.url)
    )

  } catch (error) {
    console.error('Erro no callback de confirmação:', error)
    return NextResponse.redirect(
      new URL(`/?error=${encodeURIComponent('Erro interno do servidor.')}`, request.url)
    )
  }
}