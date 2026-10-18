import React, { useState, useEffect } from 'react';
import { Download, Smartphone, Check, X, Share } from 'lucide-react';

interface AdminInstallButtonProps {
    variant?: 'sidebar' | 'header';
}

export const AdminInstallButton: React.FC<AdminInstallButtonProps> = ({ variant = 'sidebar' }) => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isStandalone, setIsStandalone] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [showIOSGuide, setShowIOSGuide] = useState(false);
    const [installedJustNow, setInstalledJustNow] = useState(false);

    useEffect(() => {
        // Verificar se já está rodando em modo aplicativo standalone
        const standaloneMode = 
            window.matchMedia('(display-mode: standalone)').matches || 
            (window.navigator as any).standalone === true;
        setIsStandalone(standaloneMode);

        // Detectar iOS
        const ua = window.navigator.userAgent.toLowerCase();
        const isIosDevice = /iphone|ipad|ipod/.test(ua) && !(window as any).MSStream;
        setIsIOS(isIosDevice);

        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        const handleAppInstalled = () => {
            setDeferredPrompt(null);
            setInstalledJustNow(true);
            setIsStandalone(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setDeferredPrompt(null);
                setInstalledJustNow(true);
            }
        } else if (isIOS) {
            setShowIOSGuide(true);
        } else {
            // Em navegadores de desktop que ainda não dispararam o evento ou exigem instalação manual
            alert('Para instalar este painel no seu computador ou celular, clique no ícone de instalação na barra de endereço do navegador ou selecione "Instalar Aplicativo" no menu de opções.');
        }
    };

    // Se já estiver rodando dentro do App PWA instalado, não precisa exibir o botão de instalação
    if (isStandalone && !installedJustNow) {
        return null;
    }

    if (installedJustNow) {
        return (
            <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-[10px] font-bold uppercase tracking-wider">
                <Check size={14} className="text-emerald-400" />
                <span>App Instalado</span>
            </div>
        );
    }

    return (
        <>
            {variant === 'sidebar' ? (
                <button
                    onClick={handleInstallClick}
                    title="Instalar Painel como Aplicativo"
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest text-sky-400 bg-sky-950/40 border border-sky-800/50 hover:bg-sky-600 hover:text-white transition-all group mb-2 shadow-sm"
                >
                    <Download size={16} strokeWidth={2.5} className="group-hover:translate-y-0.5 transition-transform" />
                    <span>Instalar App</span>
                </button>
            ) : (
                <button
                    onClick={handleInstallClick}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                    aria-label="Instalar Aplicativo"
                >
                    <Smartphone size={14} />
                    <span>Instalar App</span>
                </button>
            )}

            {/* Modal de orientação para iPhone / iPad */}
            {showIOSGuide && (
                <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-700 max-w-sm w-full rounded-2xl p-6 text-white shadow-2xl relative">
                        <button
                            onClick={() => setShowIOSGuide(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
                        >
                            <X size={20} />
                        </button>

                        <div className="w-12 h-12 bg-sky-600/20 text-sky-400 rounded-2xl flex items-center justify-center mb-4">
                            <Smartphone size={24} />
                        </div>

                        <h3 className="text-base font-bold text-white mb-2">Instalar no iPhone / iPad</h3>
                        <p className="text-xs text-slate-300 leading-relaxed mb-4">
                            Para transformar este painel em um aplicativo na tela de início do seu iPhone:
                        </p>

                        <ol className="text-xs text-slate-300 space-y-3 mb-6 bg-slate-800/60 p-4 rounded-xl border border-slate-700">
                            <li className="flex items-start gap-2">
                                <span className="font-bold text-sky-400">1.</span>
                                <span>No Safari, toque no botão de <strong className="text-white">Compartilhar</strong> (<Share size={12} className="inline mx-1" /> ícone do quadrado com a seta).</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="font-bold text-sky-400">2.</span>
                                <span>Role a lista para baixo e toque em <strong className="text-white">"Adicionar à Tela de Início"</strong>.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="font-bold text-sky-400">3.</span>
                                <span>Toque em <strong className="text-white">"Adicionar"</strong> no canto superior direito.</span>
                            </li>
                        </ol>

                        <button
                            onClick={() => setShowIOSGuide(false)}
                            className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors"
                        >
                            Entendi
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};
