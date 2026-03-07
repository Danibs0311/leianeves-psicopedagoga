import React from 'react';
import { LayoutDashboard, Calendar, Settings, LogOut, ExternalLink, User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AdminSidebarProps {
    activeView: 'dashboard' | 'patients' | 'settings';
    onNavigate: (view: 'dashboard' | 'patients' | 'settings') => void;
    onLogout: () => void;
    userEmail?: string;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeView, onNavigate, onLogout, userEmail }) => {
    return (
        <aside className="bg-white w-full md:w-64 border-r border-slate-200 flex flex-col h-screen sticky top-0">
            <div className="p-6 border-b border-slate-100">
                <span className="text-xl font-bold text-sky-700 tracking-tight block">
                    Léia<span className="text-sky-500">Neves</span>
                </span>
                <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold mt-1 block">Admin</span>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                <button
                    onClick={() => onNavigate('dashboard')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-left
                    ${activeView === 'dashboard'
                            ? 'bg-sky-50 text-sky-700 shadow-sm'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                    <LayoutDashboard size={20} />
                    Agendamentos
                </button>

                <button
                    onClick={() => onNavigate('patients')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-left
                    ${activeView === 'patients'
                            ? 'bg-sky-50 text-sky-700 shadow-sm'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                    <User size={20} />
                    Meus Pacientes
                </button>

                <button
                    onClick={() => onNavigate('settings')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-left
                    ${activeView === 'settings'
                            ? 'bg-sky-50 text-sky-700 shadow-sm'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                    <Settings size={20} />
                    Ajustes
                </button>
            </nav>

            <div className="p-4 border-t border-slate-100 space-y-2">
                {userEmail && (
                    <div className="px-4 py-2 mb-2">
                        <p className="text-xs text-slate-400 font-medium">Logado como</p>
                        <p className="text-sm text-slate-700 truncate" title={userEmail}>{userEmail}</p>
                    </div>
                )}

                <Link to="/" className="w-full flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-sky-600 transition-colors text-sm font-medium">
                    <ExternalLink size={18} />
                    Ver Site
                </Link>

                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                >
                    <LogOut size={18} />
                    Sair
                </button>
            </div>
        </aside>
    );
};
