import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, KeyRound, Mail, Loader2, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';

export const AdminLogin: React.FC = () => {
    const { isRecovering: authIsRecovering } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loginLoading, setLoginLoading] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    
    // Recovery/Reset State
    const [isRecoveryMode, setIsRecoveryMode] = useState(false);
    const [isResettingPassword, setIsResettingPassword] = useState(false);
    const [recoveryLoading, setRecoveryLoading] = useState(false);

    // Detect if we are coming from a password reset link
    useEffect(() => {
        const urlIsRecovery = window.location.hash.includes('type=recovery') || window.location.search.includes('type=recovery');
        if (urlIsRecovery || authIsRecovering) {
            setIsResettingPassword(true);
            setSuccessMessage('Link de recuperação validado! Por favor, defina sua nova senha abaixo.');
        }
    }, [authIsRecovering]);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginLoading(true);
        setLoginError(null);
        setSuccessMessage(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
        } catch (error: any) {
            console.error('Auth error:', error);
            setLoginError(error.message || 'Falha na autenticação. Verifique os dados.');
        } finally {
            setLoginLoading(false);
        }
    };

    const handlePasswordRecovery = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            setLoginError('Por favor, digite seu e-mail para recuperar a senha.');
            return;
        }

        setRecoveryLoading(true);
        setLoginError(null);
        setSuccessMessage(null);

        try {
            // This sends the email. redirectTo must match what's in Supabase Dashboard
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/admin`,
            });
            
            if (error) throw error;
            
            setSuccessMessage('E-mail de recuperação enviado! Verifique sua caixa de entrada.');
            setIsRecoveryMode(false);
        } catch (error: any) {
            console.error('Recovery error:', error);
            setLoginError(error.message || 'Erro ao enviar e-mail de recuperação.');
        } finally {
            setRecoveryLoading(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password.length < 6) {
            setLoginError('A nova senha deve ter pelo menos 6 caracteres.');
            return;
        }

        setLoginLoading(true);
        setLoginError(null);

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });
            
            if (error) throw error;
            
            setSuccessMessage('Senha atualizada com sucesso! Você já pode entrar com as novas credenciais.');
            
            // Limpa a URL para não re-disparar o modo de reset
            window.history.replaceState(null, '', window.location.pathname);
            
            setIsResettingPassword(false);
            setPassword('');
        } catch (error: any) {
            console.error('Update password error:', error);
            setLoginError(error.message || 'Erro ao atualizar a senha. O link pode ter expirado.');
        } finally {
            setLoginLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center text-sky-600 mx-auto mb-4">
                        {isResettingPassword ? <CheckCircle2 size={32} /> : isRecoveryMode ? <Send size={32} /> : <KeyRound size={32} />}
                    </div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                        {isResettingPassword ? 'Nova Senha' : isRecoveryMode ? 'Recuperar Senha' : 'Acesso Restrito'}
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        {isResettingPassword 
                            ? 'Digite sua nova senha de acesso mestre.'
                            : isRecoveryMode 
                                ? 'Enviaremos um link para o seu e-mail cadastrado.' 
                                : 'Painel Administrativo Léia Neves'}
                    </p>
                </div>

                {loginError && (
                    <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-sm flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-1.5 shrink-0" />
                        {loginError}
                    </div>
                )}

                {successMessage && (
                    <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl text-sm font-medium flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0" />
                        {successMessage}
                    </div>
                )}

                {isResettingPassword ? (
                    /* UPDATE PASSWORD FORM */
                    <form onSubmit={handleUpdatePassword} className="space-y-5">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Nova Senha</label>
                            <div className="relative">
                                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white outline-none transition-all text-slate-700 font-mono"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loginLoading}
                            className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 disabled:opacity-70 flex items-center justify-center gap-2 mt-2"
                        >
                            {loginLoading ? (
                                <Loader2 className="animate-spin w-5 h-5" />
                            ) : (
                                'Redefinir Minha Senha'
                            )}
                        </button>
                    </form>
                ) : !isRecoveryMode ? (
                    /* LOGIN FORM */
                    <form onSubmit={handleAuth} className="space-y-5">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">E-mail de Acesso</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white outline-none transition-all text-slate-700"
                                    placeholder="seu@email.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1.5 ml-1">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Senha Mestre</label>
                                <button 
                                    type="button"
                                    onClick={() => setIsRecoveryMode(true)}
                                    className="text-[10px] font-bold text-sky-600 hover:text-sky-700 uppercase tracking-widest"
                                >
                                    Esqueci a senha
                                </button>
                            </div>
                            <div className="relative">
                                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white outline-none transition-all text-slate-700 font-mono"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loginLoading}
                            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 disabled:opacity-70 flex items-center justify-center gap-2 mt-2"
                        >
                            {loginLoading ? (
                                <Loader2 className="animate-spin w-5 h-5" />
                            ) : (
                                'Entrar no Painel'
                            )}
                        </button>
                    </form>
                ) : (
                    /* RECOVERY FORM */
                    <form onSubmit={handlePasswordRecovery} className="space-y-5">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">E-mail Cadastrado</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white outline-none transition-all text-slate-700"
                                    placeholder="seu@email.com"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={recoveryLoading}
                            className="w-full bg-sky-600 text-white py-4 rounded-xl font-bold hover:bg-sky-700 transition-all shadow-lg shadow-sky-100 disabled:opacity-70 flex items-center justify-center gap-2 mt-2"
                        >
                            {recoveryLoading ? (
                                <Loader2 className="animate-spin w-5 h-5" />
                            ) : (
                                'Enviar Link de Recuperação'
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsRecoveryMode(false)}
                            className="w-full flex items-center justify-center gap-2 text-slate-500 hover:text-slate-800 font-bold text-sm transition-colors py-2"
                        >
                            <ArrowLeft size={16} /> Voltar para Login
                        </button>
                    </form>
                )}

                <div className="text-center mt-8 pt-6 border-t border-slate-100">
                    <Link to="/" className="text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest flex items-center justify-center gap-2">
                        <ArrowLeft size={12} /> Voltar para o Site
                    </Link>
                </div>
            </div>
        </div>
    );
};
