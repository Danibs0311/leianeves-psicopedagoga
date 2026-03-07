import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';

export const AdminLogin: React.FC = () => {
    // START IN SIGNUP MODE TO FORCE USER TO CREATE ACCOUNT FIRST
    const [isLoginMode, setIsLoginMode] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginLoading(true);
        setLoginError(null);
        setSuccessMessage(null);

        try {
            if (isLoginMode) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
            } else {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                if (data.user) {
                    setSuccessMessage('Conta criada com sucesso! Você já pode entrar.');
                    setIsLoginMode(true);
                }
            }
        } catch (error: any) {
            console.error('Auth error:', error);
            setLoginError(error.message || 'Falha na autenticação. Verifique os dados.');
        } finally {
            setLoginLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <h1 className="text-2xl font-bold text-slate-800 mb-2 text-center">
                    {isLoginMode ? 'Área Administrativa' : 'Criar Conta Mestre'}
                </h1>
                {!isLoginMode && (
                    <p className="text-center text-sm text-amber-600 font-medium mb-6">
                        Atenção: Cadastre seu e-mail e senha de acesso seguro agora.
                    </p>
                )}

                {loginError && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center">
                        {loginError}
                    </div>
                )}

                {successMessage && (
                    <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm text-center font-medium">
                        {successMessage}
                    </div>
                )}

                <form onSubmit={handleAuth} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
                            placeholder="seu@email.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
                            placeholder="Sua senha"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loginLoading}
                        className={`w-full text-white py-2 rounded-lg font-bold transition-colors disabled:opacity-70 flex justify-center ${isLoginMode ? 'bg-sky-600 hover:bg-sky-700' : 'bg-green-600 hover:bg-green-700'}`}
                    >
                        {loginLoading ? 'Carregando...' : isLoginMode ? 'Entrar' : 'Criar Conta Agora'}
                    </button>

                    <div className="text-center pt-4 border-t border-slate-100 mt-4 space-y-2 flex flex-col">
                        <button
                            type="button"
                            onClick={() => {
                                setIsLoginMode(!isLoginMode);
                                setLoginError(null);
                                setSuccessMessage(null);
                            }}
                            className="text-sm text-sky-600 font-medium hover:underline"
                        >
                            {isLoginMode ? 'Primeiro acesso? Crie sua conta master aqui' : 'Já tem conta? Fazer Login'}
                        </button>
                        <Link to="/" className="text-sm text-slate-500 hover:text-slate-800 pt-2 inline-block">Voltar para o site</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};
