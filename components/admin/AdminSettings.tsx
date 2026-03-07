import React from 'react';
import { User, Clock, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const AdminSettings: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="space-y-6">
            <header className="mb-8">
                <h2 className="text-2xl font-bold text-slate-800">Ajustes & Configurações</h2>
                <p className="text-slate-500">Gerencie seu perfil e preferências do sistema.</p>
            </header>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Profile Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center text-sky-600">
                            <User size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">Perfil do Usuário</h3>
                            <p className="text-sm text-slate-500">Informações da conta atual</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">E-mail</label>
                            <div className="font-medium text-slate-700">{user?.email}</div>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">ID do Usuário</label>
                            <div className="font-mono text-xs text-slate-500">{user?.id}</div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                            <Shield size={16} />
                            <span>Conta de Administrador Ativa</span>
                        </div>
                    </div>
                </div>

                {/* Coming Soon Features */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 opacity-60 relative overflow-hidden">
                    <div className="absolute top-4 right-4 bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded uppercase">Em Breve</div>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                            <Clock size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">Horários de Atendimento</h3>
                            <p className="text-sm text-slate-500">Configurar disponibilidade na agenda</p>
                        </div>
                    </div>

                    <p className="text-slate-500 text-sm leading-relaxed mb-4">
                        Em breve você poderá definir seus horários disponíveis, dias de folga e intervalos diretamente por aqui para sincronizar com o formulário de agendamento.
                    </p>

                    <button disabled className="w-full py-2 bg-slate-100 text-slate-400 rounded-lg font-bold cursor-not-allowed">
                        Gerenciar Horários
                    </button>
                </div>
            </div>
        </div>
    );
};
