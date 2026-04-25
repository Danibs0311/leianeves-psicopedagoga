import React, { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { SchedulingModal } from '../SchedulingModal';
import { useAuth } from '../../contexts/AuthContext';
import { Menu, X } from 'lucide-react';

interface AdminLayoutProps {
    children: React.ReactNode;
    activeView: 'dashboard' | 'patients' | 'settings' | 'blog';
    onNavigate: (view: 'dashboard' | 'patients' | 'settings' | 'blog') => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeView, onNavigate }) => {
    const { user, signOut } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSchedulingModalOpen, setIsSchedulingModalOpen] = useState(false);

    const handleNavigate = (view: 'dashboard' | 'patients' | 'settings' | 'blog') => {
        onNavigate(view);
        setIsMobileMenuOpen(false);
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Desktop Sidebar */}
            <div className="hidden md:block sticky top-0 h-screen flex-none print:hidden">
                <AdminSidebar
                    activeView={activeView}
                    onNavigate={handleNavigate}
                    onLogout={signOut}
                    onOpenScheduling={() => setIsSchedulingModalOpen(true)}
                    userEmail={user?.email}
                />
            </div>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full bg-slate-900 border-b border-slate-800 z-50 px-6 py-4 flex justify-between items-center shadow-lg print:hidden">
                <span className="font-black text-white text-sm tracking-widest uppercase">Admin Panel</span>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 text-white hover:bg-slate-800 rounded-lg"
                    aria-label="Abrir menu lateral"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="absolute left-0 top-0 h-full w-72 bg-slate-900 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <AdminSidebar
                            activeView={activeView}
                            onNavigate={handleNavigate}
                            onLogout={signOut}
                            onOpenScheduling={() => setIsSchedulingModalOpen(true)}
                            userEmail={user?.email}
                        />
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-12 pt-24 md:pt-12 w-full max-w-[1600px] mx-auto overflow-x-hidden">
                {children}
            </main>

            {/* Global Scheduling Modal for Admin */}
            <SchedulingModal
                isOpen={isSchedulingModalOpen}
                onClose={() => setIsSchedulingModalOpen(false)}
            />
        </div>
    );
};
