"use client";

import { useState } from 'react';
import { MessageCircle, Send, Bot, User as UserIcon, Settings, Save } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Olá! Sou seu mentor financeiro da Fortaleza Nível 12. Como posso ajudá-lo hoje?',
      sender: 'ai',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const aiResponses = [
    "A liberdade começa no controle. Que tal começarmos organizando suas entradas e saídas?",
    "Disciplina constrói fortalezas. Você está no caminho certo para o próximo nível!",
    "Lembre-se: cada centavo economizado é um tijolo na sua fortaleza financeira.",
    "O investimento de hoje é a liberdade de amanhã. Continue focado nos seus objetivos!",
    "Sua mente constrói sua liberdade. Que estratégia financeira podemos desenvolver juntos?",
    "Você está mais perto do seu próximo nível. Vamos analisar seus gastos para acelerar o processo?",
  ];

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simular resposta da IA
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Assistente IA</h2>
        <p className="text-blue-100">Seu mentor financeiro pessoal está aqui para ajudar!</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 h-96 flex flex-col">
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
                message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.sender === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-yellow-400 text-black'
                }`}>
                  {message.sender === 'user' ? (
                    <UserIcon className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>
                <div className={`px-4 py-2 rounded-2xl ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2">
                <div className="w-8 h-8 bg-yellow-400 text-black rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-gray-100 px-4 py-2 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Digite sua pergunta sobre finanças..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SettingsTab = ({ user, onUpdateUser }: { 
  user: any; 
  onUpdateUser: (updates: any) => void; 
}) => {
  const [settings, setSettings] = useState({
    monthlyLivingCost: user.monthlyLivingCost,
    financialReserve: user.financialReserve,
    monthlySpendingLimit: user.monthlySpendingLimit,
  });

  const handleSave = () => {
    onUpdateUser(settings);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Configurações</h2>
        <p className="text-gray-300">Configure seus parâmetros financeiros para calcular seu nível da fortaleza.</p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Parâmetros Financeiros</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custo de Vida Mensal (US$)
            </label>
            <input
              type="number"
              step="0.01"
              value={settings.monthlyLivingCost}
              onChange={(e) => setSettings({ ...settings, monthlyLivingCost: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="3000.00"
            />
            <p className="text-sm text-gray-500 mt-1">
              Valor necessário para cobrir suas despesas mensais básicas
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reserva Financeira Atual (US$)
            </label>
            <input
              type="number"
              step="0.01"
              value={settings.financialReserve}
              onChange={(e) => setSettings({ ...settings, financialReserve: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="15000.00"
            />
            <p className="text-sm text-gray-500 mt-1">
              Total de dinheiro que você tem guardado/investido
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Limite de Gastos Mensal (US$)
            </label>
            <input
              type="number"
              step="0.01"
              value={settings.monthlySpendingLimit}
              onChange={(e) => setSettings({ ...settings, monthlySpendingLimit: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="2500.00"
            />
            <p className="text-sm text-gray-500 mt-1">
              Meta máxima de gastos por mês (receberá alerta se ultrapassar)
            </p>
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
          >
            <Save className="w-5 h-5 inline mr-2" />
            Salvar Configurações
          </button>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">Como funciona o Nível da Fortaleza?</h3>
        <div className="text-yellow-700 space-y-2">
          <p><strong>Fórmula:</strong> Nível = Reserva Financeira ÷ Custo de Vida Mensal</p>
          <p><strong>Exemplo:</strong> US$15.000 ÷ US$3.000 = Nível 5</p>
          <p><strong>Meta:</strong> Alcançar o Nível 12 significa ter 12 meses de reserva!</p>
        </div>
      </div>
    </div>
  );
};