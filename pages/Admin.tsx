import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AdminLogin } from '../components/admin/AdminLogin';
import { AdminLayout } from '../components/admin/AdminLayout';
import { AdminAppointments } from '../components/admin/AdminAppointments';
import { AdminSettings } from '../components/admin/AdminSettings';
import { AdminPatients } from '../components/admin/AdminPatients';
import { AdminPatientDetail } from '../components/admin/AdminPatientDetail';

export const Admin: React.FC = () => {
    const { user, loading: authLoading } = useAuth();
    const [activeView, setActiveView] = useState<'dashboard' | 'patients' | 'settings'>('dashboard');
    const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-2">
                    <div className="animate-spin w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full"></div>
                    <p className="text-slate-500">Verificando segurança...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <AdminLogin />;
    }

    return (
        <AdminLayout activeView={activeView} onNavigate={setActiveView}>
            {activeView === 'dashboard' && <AdminAppointments />}

            {activeView === 'patients' && (
                selectedPatientId ? (
                    <AdminPatientDetail
                        patientId={selectedPatientId}
                        onBack={() => setSelectedPatientId(null)}
                    />
                ) : (
                    <AdminPatients onSelectPatient={(id) => setSelectedPatientId(id)} />
                )
            )}

            {activeView === 'settings' && <AdminSettings />}
        </AdminLayout>
    );
};
