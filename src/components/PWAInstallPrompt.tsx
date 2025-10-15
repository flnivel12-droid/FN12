"use client";

import { useEffect, useState } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Detectar iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Detectar se já está instalado (modo standalone)
    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(standalone);

    // Registrar service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registrado com sucesso:', registration);
        })
        .catch((error) => {
          console.log('Falha ao registrar Service Worker:', error);
        });
    }

    // Listener para o evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Mostrar prompt após 3 segundos se não estiver instalado
      setTimeout(() => {
        if (!standalone) {
          setShowInstallPrompt(true);
        }
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('Usuário aceitou instalar o app');
    } else {
      console.log('Usuário recusou instalar o app');
    }
    
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Não mostrar novamente nesta sessão
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('installPromptDismissed', 'true');
    }
  };

  // Não mostrar se já está instalado ou foi dispensado nesta sessão
  if (isStandalone || (typeof window !== 'undefined' && sessionStorage.getItem('installPromptDismissed'))) {
    return null;
  }

  // Prompt para iOS
  if (isIOS && showInstallPrompt) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl p-4 shadow-2xl border border-yellow-300">
        <div className="flex items-start justify-between">
          <div className="flex items-center flex-1">
            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mr-4">
              <Smartphone className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-black text-lg">Instalar Fortaleza Nível 12</h3>
              <p className="text-black/80 text-sm mb-2">
                Adicione à tela inicial para acesso rápido
              </p>
              <div className="text-xs text-black/70">
                Toque em <span className="font-semibold">Compartilhar</span> → <span className="font-semibold">Adicionar à Tela Inicial</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="p-2 hover:bg-black/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-black" />
          </button>
        </div>
      </div>
    );
  }

  // Prompt para Android/Desktop
  if (showInstallPrompt && deferredPrompt) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl p-4 shadow-2xl border border-yellow-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-1">
            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mr-4">
              <Download className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-black text-lg">Instalar Fortaleza Nível 12</h3>
              <p className="text-black/80 text-sm">
                Instale o app para acesso rápido e funcionalidades offline
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleInstallClick}
              className="bg-black text-yellow-400 font-semibold px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors"
            >
              Instalar
            </button>
            <button
              onClick={handleDismiss}
              className="p-2 hover:bg-black/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-black" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}