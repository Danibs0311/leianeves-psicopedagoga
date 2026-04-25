import { LayoutDashboard, Users, Settings, LogOut, FileText, ExternalLink, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AdminSidebarProps {
    activeView: 'dashboard' | 'patients' | 'settings' | 'blog';
    onNavigate: (view: 'dashboard' | 'patients' | 'settings' | 'blog') => void;
    onLogout: () => void;
    onOpenScheduling: () => void;
    userEmail?: string;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
    activeView,
    onNavigate,
    onLogout,
    onOpenScheduling,
    userEmail
}) => {
    const menuItems = [
        { id: 'dashboard', label: 'Agenda', icon: LayoutDashboard },
        { id: 'patients', label: 'Pacientes', icon: Users },
        { id: 'blog', label: 'Gestão Blog', icon: FileText },
        { id: 'settings', label: 'Configurações', icon: Settings },
    ] as const;

    return (
        <div className="w-64 h-screen bg-slate-900 flex flex-col text-white">
            <div className="p-8 border-b border-slate-800">
                <h1 className="text-xl font-black tracking-tighter">
                    Léia<span className="text-sky-500">Neves</span>
                    <span className="block text-[9px] text-slate-500 uppercase tracking-[0.3em] mt-1 font-bold">Painel de Gestão</span>
                </h1>
            </div>

            <div className="px-4 mt-6">
                <button
                    onClick={onOpenScheduling}
                    className="w-full flex items-center justify-center gap-3 bg-sky-600 hover:bg-sky-700 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-lg shadow-sky-900/40 group"
                >
                    <Plus size={18} strokeWidth={3} className="group-hover:scale-110 transition-transform" />
                    Novo Agendamento
                </button>
            </div>

            <nav className="flex-1 p-4 mt-2 overflow-y-auto scrollbar-hide hover:scrollbar-default transition-all">
                <ul className="space-y-2">
                    {menuItems.map((item) => (
                        <li key={item.id}>
                            <button
                                onClick={() => onNavigate(item.id)}
                                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[13px] font-black uppercase tracking-widest transition-all ${
                                    activeView === item.id
                                        ? 'bg-sky-600 text-white shadow-lg shadow-sky-900/20'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                }`}
                            >
                                <item.icon size={18} strokeWidth={2.5} />
                                {item.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="p-6 border-t border-slate-800 bg-slate-900/50">
                <div className="mb-6 px-4">
                    <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Logado como</span>
                    <span className="block text-xs font-bold text-slate-300 truncate">{userEmail}</span>
                </div>
                <Link
                    to="/"
                    className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[13px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-slate-800 transition-all mb-2"
                >
                    <ExternalLink size={18} strokeWidth={2.5} />
                    Ver Site
                </Link>
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[13px] font-black uppercase tracking-widest text-rose-400 hover:bg-rose-500/10 transition-all"
                >
                    <LogOut size={18} strokeWidth={2.5} />
                    Sair
                </button>
            </div>
        </div>
    );
};
