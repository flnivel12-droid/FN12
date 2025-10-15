"use client";

import { useState } from 'react';
import { Users, Copy, Share2, Gift, DollarSign } from 'lucide-react';

interface ReferralTabProps {
  user: any;
}

export const ReferralTab = ({ user }: ReferralTabProps) => {
  const [referralCode] = useState(`FN12-${user.id.slice(0, 8).toUpperCase()}`);
  const [referrals] = useState([
    { id: '1', name: 'João Silva', status: 'active', earnings: 25.00, date: '2024-01-15' },
    { id: '2', name: 'Maria Santos', status: 'pending', earnings: 0, date: '2024-01-20' },
    { id: '3', name: 'Pedro Costa', status: 'active', earnings: 25.00, date: '2024-01-25' },
  ]);

  const totalEarnings = referrals.reduce((sum, ref) => sum + ref.earnings, 0);
  const activeReferrals = referrals.filter(ref => ref.status === 'active').length;

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    // Aqui você poderia adicionar um toast de confirmação
  };

  const shareReferralLink = () => {
    const referralLink = `https://fortalezanivel12.com/register?ref=${referralCode}`;
    if (navigator.share) {
      navigator.share({
        title: 'Fortaleza Nível 12',
        text: 'Junte-se a mim na Fortaleza Nível 12 e construa sua liberdade financeira!',
        url: referralLink,
      });
    } else {
      navigator.clipboard.writeText(referralLink);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Programa de Indicações</h2>
        <p className="text-green-100">Ganhe US$25 para cada amigo que se juntar à Fortaleza!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Ganho</p>
              <p className="text-2xl font-bold text-green-600">${totalEarnings.toFixed(2)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Indicações Ativas</p>
              <p className="text-2xl font-bold text-blue-600">{activeReferrals}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Indicações</p>
              <p className="text-2xl font-bold text-purple-600">{referrals.length}</p>
            </div>
            <Gift className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Referral Code Section */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Seu Código de Indicação</h3>
        
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1 bg-gray-50 rounded-xl p-4 border-2 border-dashed border-gray-300">
            <p className="text-center text-xl font-mono font-bold text-gray-900">{referralCode}</p>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={copyReferralCode}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center"
          >
            <Copy className="w-5 h-5 mr-2" />
            Copiar Código
          </button>
          
          <button
            onClick={shareReferralLink}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Compartilhar Link
          </button>
        </div>
      </div>

      {/* How it Works */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Como Funciona</h3>
        <div className="space-y-3 text-blue-800">
          <div className="flex items-start">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</div>
            <p>Compartilhe seu código de indicação com amigos e familiares</p>
          </div>
          <div className="flex items-start">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</div>
            <p>Quando eles se cadastrarem usando seu código, ambos ganham benefícios</p>
          </div>
          <div className="flex items-start">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</div>
            <p>Você ganha US$25 e seu amigo ganha 1 mês grátis de premium</p>
          </div>
        </div>
      </div>

      {/* Referrals List */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Suas Indicações</h3>
        
        <div className="space-y-3">
          {referrals.map((referral) => (
            <div key={referral.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {referral.name.charAt(0)}
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">{referral.name}</p>
                  <p className="text-sm text-gray-500">Indicado em {new Date(referral.date).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-semibold text-green-600">${referral.earnings.toFixed(2)}</p>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  referral.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {referral.status === 'active' ? 'Ativo' : 'Pendente'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};