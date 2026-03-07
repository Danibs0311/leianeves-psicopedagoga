import React, { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { useAuth } from '../../contexts/AuthContext';
import { Menu, X } from 'lucide-react';

interface AdminLayoutProps {
    children: React.ReactNode;
    activeView: 'dashboard' | 'patients' | 'settings';
    onNavigate: (view: 'dashboard' | 'patients' | 'settings') => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeView, onNavigate }) => {
    const { user, signOut } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleNavigate = (view: 'dashboard' | 'patients' | 'settings') => {
        onNavigate(view);
        setIsMobileMenuOpen(false);
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Desktop Sidebar */}
            <div className="hidden md:block">
                <AdminSidebar
                    activeView={activeView}
                    onNavigate={handleNavigate}
                    onLogout={signOut}
                    userEmail={user?.email}
                />
            </div>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full bg-white border-b border-slate-200 z-50 px-4 py-3 flex justify-between items-center shadow-sm">
                <span className="font-bold text-slate-800">Admin Panel</span>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl" onClick={e => e.stopPropagation()}>
                        <AdminSidebar
                            activeView={activeView}
                            onNavigate={handleNavigate}
                            onLogout={signOut}
                            userEmail={user?.email}
                        />
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8 w-full max-w-[1600px] mx-auto overflow-x-hidden">
                {children}
            </main>
        </div>
    );
};
