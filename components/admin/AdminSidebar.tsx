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
        <div className="w-full h-screen bg-slate-900 flex flex-col text-white">
            <div className="p-4 border-b border-slate-800">
                <h1 className="text-lg font-black tracking-tighter">
                    Léia<span className="text-sky-500">Neves</span>
                    <span className="block text-[8px] text-slate-500 uppercase tracking-[0.2em] mt-0.5 font-bold">Painel de Gestão</span>
                </h1>
            </div>

            <div className="px-3 mt-4">
                <button
                    onClick={onOpenScheduling}
                    className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-sky-900/40 group"
                >
                    <Plus size={16} strokeWidth={3} className="group-hover:scale-110 transition-transform" />
                    Agendar
                </button>
            </div>

            <nav className="flex-1 p-2 mt-2">
                <ul className="space-y-1">
                    {menuItems.map((item) => (
                        <li key={item.id}>
                            <button
                                onClick={() => onNavigate(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                                    activeView === item.id
                                        ? 'bg-sky-600 text-white shadow-lg shadow-sky-900/20'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                }`}
                            >
                                <item.icon size={16} strokeWidth={2.5} />
                                {item.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="p-4 border-t border-slate-800 bg-slate-900/50">
                <div className="mb-4 px-2">
                    <span className="block text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">Admin</span>
                    <span className="block text-[11px] font-bold text-slate-300 truncate">{userEmail}</span>
                </div>
                <Link
                    to="/"
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-slate-800 transition-all mb-1"
                >
                    <ExternalLink size={16} strokeWidth={2.5} />
                    Ver Site
                </Link>
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest text-rose-400 hover:bg-rose-500/10 transition-all"
                >
                    <LogOut size={16} strokeWidth={2.5} />
                    Sair
                </button>
            </div>
        </div>
    );
};
