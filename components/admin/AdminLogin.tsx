import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';

export const AdminLogin: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginLoading(true);
        setLoginError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
        } catch (error) {
            console.error('Login error:', error);
            setLoginError('Falha ao entrar. Verifique suas credenciais.');
        } finally {
            setLoginLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center">Área Administrativa</h1>

                {loginError && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center">
                        {loginError}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
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
                        className="w-full bg-sky-600 text-white py-2 rounded-lg font-bold hover:bg-sky-700 transition-colors disabled:opacity-70 flex justify-center"
                    >
                        {loginLoading ? 'Entrando...' : 'Entrar'}
                    </button>
                    <div className="text-center pt-2">
                        <Link to="/" className="text-sm text-slate-500 hover:text-sky-600">Voltar para o site</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};
