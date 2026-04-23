import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AdminLogin } from '../components/admin/AdminLogin';
import { AdminLayout } from '../components/admin/AdminLayout';
import { AdminAppointments } from '../components/admin/AdminAppointments';
import { AdminSettings } from '../components/admin/AdminSettings';
import { AdminPatients } from '../components/admin/AdminPatients';
import { AdminPatientDetail } from '../components/admin/AdminPatientDetail';
import { AdminBlog } from '../components/admin/AdminBlog';

export const Admin: React.FC = () => {
    const { user, loading: authLoading } = useAuth();
    const { tab, id } = useParams<{ tab?: string; id?: string }>();
    const navigate = useNavigate();

    // Map URL chunks to view states
    const urlToView: Record<string, 'dashboard' | 'patients' | 'settings' | 'blog'> = {
        'agenda': 'dashboard',
        'pacientes': 'patients',
        'configuracoes': 'settings',
        'blog': 'blog'
    };
    
    const viewToUrl: Record<string, string> = {
        'dashboard': 'agenda',
        'patients': 'pacientes',
        'settings': 'configuracoes',
        'blog': 'blog'
    };

    const activeView = tab && urlToView[tab] ? urlToView[tab] : 'dashboard';
    const selectedPatientId = id ? Number(id) : null;

    useEffect(() => {
        if (!tab && user) {
            navigate('/admin/agenda', { replace: true });
        }
    }, [tab, user, navigate]);

    const navigateTo = (view: 'dashboard' | 'patients' | 'settings' | 'blog', patientId: number | null = null) => {
        const urlChunk = viewToUrl[view];
        if (patientId) {
            navigate(`/admin/${urlChunk}/${patientId}`);
        } else {
            navigate(`/admin/${urlChunk}`);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full"></div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Autenticando...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <AdminLogin />;
    }

    return (
        <AdminLayout activeView={activeView} onNavigate={(view) => navigateTo(view)}>
            {activeView === 'dashboard' && <AdminAppointments />}

            {activeView === 'blog' && <AdminBlog />}

            {activeView === 'patients' && (
                selectedPatientId ? (
                    <AdminPatientDetail
                        patientId={selectedPatientId}
                        onBack={() => navigateTo('patients')}
                    />
                ) : (
                    <AdminPatients onSelectPatient={(id) => navigateTo('patients', id)} />
                )
            )}

            {activeView === 'settings' && <AdminSettings />}
        </AdminLayout>
    );
};
