"use client";

import { useState, useEffect } from 'react';
import { Crown, Shield, Sparkles, Target, TrendingUp, ArrowRight } from 'lucide-react';

interface WelcomeScreenProps {
  onContinue: () => void;
}

export const WelcomeScreen = ({ onContinue }: WelcomeScreenProps) => {
  const [showContent, setShowContent] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowContent(true), 500);
    const timer2 = setTimeout(() => setShowButton(true), 2000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-2 h-2 bg-yellow-400 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-yellow-300 rounded-full animate-ping opacity-40"></div>
        <div className="absolute bottom-32 left-40 w-3 h-3 bg-yellow-500 rounded-full animate-bounce opacity-50"></div>
        <div className="absolute top-60 left-1/3 w-1 h-1 bg-yellow-400 rounded-full animate-pulse opacity-70"></div>
        <div className="absolute bottom-20 right-20 w-2 h-2 bg-yellow-300 rounded-full animate-ping opacity-50"></div>
        
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-yellow-400/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-yellow-600/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-2xl w-full text-center relative z-10">
        <div className={`transition-all duration-1000 transform ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="relative mb-8">
            <div className="absolute inset-0 w-32 h-32 mx-auto">
              <div className="w-full h-full border-2 border-yellow-400/30 rounded-full animate-spin" style={{ animationDuration: '8s' }}></div>
              <div className="absolute inset-2 w-28 h-28 border border-yellow-500/20 rounded-full animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }}></div>
            </div>
            
            <div className="relative w-24 h-24 mx-auto mb-6 bg-black rounded-full flex items-center justify-center shadow-2xl">
              <img 
                src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/afa5b2c1-993f-4a9d-8ad1-00ca5d9bbce1.png" 
                alt="Logo FN12" 
                className="w-20 h-20 rounded-full object-cover"
              />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Fortaleza Nível 12
          </h1>
          
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto mb-8"></div>
        </div>

        <div className={`transition-all duration-1500 delay-500 transform ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-black/40 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-yellow-500/20 shadow-2xl mb-8">
            <div className="flex justify-center space-x-4 mb-6">
              <div className="w-8 h-8 bg-yellow-400/20 rounded-full flex items-center justify-center">
                <Crown className="w-4 h-4 text-yellow-400" />
              </div>
              <div className="w-8 h-8 bg-yellow-400/20 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-yellow-400" />
              </div>
              <div className="w-8 h-8 bg-yellow-400/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </div>
            </div>

            <blockquote className="text-xl md:text-2xl text-gray-100 leading-relaxed font-light italic mb-6">
              "Bem-vindo ao mundo dos investidores. Aqui, sua mente constrói sua liberdade. 
              Esta é sua <span className="text-yellow-400 font-semibold not-italic">Fortaleza Nível 12</span>."
            </blockquote>

            <div className="flex justify-center space-x-8 text-gray-400 text-sm">
              <div className="flex items-center">
                <Target className="w-4 h-4 mr-2 text-yellow-400" />
                <span>Liberdade Financeira</span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-yellow-400" />
                <span>Crescimento Inteligente</span>
              </div>
            </div>
          </div>
        </div>

        <div className={`transition-all duration-1000 delay-1000 transform ${showButton ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'}`}>
          <button
            onClick={onContinue}
            className="group relative bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold py-4 px-12 rounded-2xl hover:from-yellow-500 hover:to-yellow-700 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl shadow-yellow-500/25"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-300/0 via-white/20 to-yellow-300/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative flex items-center justify-center">
              <span className="text-lg mr-3">Iniciar Jornada</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </button>

          <p className="text-gray-400 text-sm mt-4 opacity-80">
            Sua transformação financeira começa agora
          </p>
        </div>

        <div className={`mt-12 transition-all duration-1000 delay-1500 transform ${showButton ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-yellow-400/60 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-yellow-400/30 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};