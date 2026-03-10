import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Calendar, Clock, Phone, Mail, User, CheckCircle, XCircle, Search, Filter, Trash2 } from 'lucide-react';

interface Appointment {
    id: number;
    created_at: string;
    parent_name: string;
    child_name: string;
    child_age: number;
    cpf?: string; // Add CPF
    email: string;
    phone: string;
    concern: string;
    preferred_date: string;
    preferred_time: string;
    status: string;
}

export const AdminAppointments: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled' | 'completed'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('appointments')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) setAppointments(data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
            alert('Erro ao carregar agendamentos');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: number, verifyStatus: string) => {
        try {
            // First update the appointment status
            const { error } = await supabase
                .from('appointments')
                .update({ status: verifyStatus })
                .eq('id', id);

            if (error) throw error;

            // If marking as completed, check/create patient record
            if (verifyStatus === 'completed') {
                const appointment = appointments.find(app => app.id === id);
                if (appointment) {
                    await handlePatientCreation(appointment);
                }
            }

            setAppointments(appointments.map(app =>
                app.id === id ? { ...app, status: verifyStatus } : app
            ));
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Erro ao atualizar status');
        }
    };

    const deleteAppointment = async (id: number) => {
        if (!window.confirm('Tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita.')) return;

        try {
            const { error } = await supabase
                .from('appointments')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setAppointments(appointments.filter(app => app.id !== id));
        } catch (error) {
            console.error('Error deleting appointment:', error);
            alert('Erro ao excluir agendamento');
        }
    };

    const handlePatientCreation = async (appointment: Appointment) => {
        try {
            // Check if patient already exists by CPF (Priority) or fallback to name if no CPF
            let existingPatient = null;

            if (appointment.cpf) {
                const { data, error } = await supabase
                    .from('patients')
                    .select('id')
                    .eq('cpf', appointment.cpf)
                    .single();

                if (!error) existingPatient = data;
            } else {
                // Fallback for old records without CPF
                const { data, error } = await supabase
                    .from('patients')
                    .select('id')
                    .eq('child_name', appointment.child_name)
                    .eq('parent_name', appointment.parent_name)
                    .single();

                if (!error) existingPatient = data;
            }

            // Only create if not found
            if (!existingPatient) {
                const { error: insertError } = await supabase
                    .from('patients')
                    .insert({
                        child_name: appointment.child_name,
                        parent_name: appointment.parent_name,
                        phone: appointment.phone,
                        cpf: appointment.cpf, // Save CPF
                        email: appointment.email,
                        notes: `Paciente criado automaticamente a partir do agendamento #${appointment.id}. Queixa: ${appointment.concern}`,
                    });

                if (insertError) {
                    console.error('Error creating patient record:', insertError);
                    alert('Aviso: Não foi possível criar o registro do paciente automaticamente (possível CPF duplicado).');
                } else {
                    console.log('Patient record created successfully');
                }
            } else {
                console.log('Patient already exists, linking appointment to history...');
                // Ideally we would update the appointment with patient_id here if we had that column
            }
        } catch (err) {
            console.error('Unexpected error creating patient:', err);
        }
    };

    const filteredAppointments = appointments.filter(app => {
        const matchesFilter = filter === 'all' || app.status === filter;
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
            app.parent_name.toLowerCase().includes(searchLower) ||
            app.child_name.toLowerCase().includes(searchLower) ||
            app.email.toLowerCase().includes(searchLower);

        return matchesFilter && matchesSearch;
    }).sort((a, b) => {
        // Only apply special sorting for 'all' tab
        if (filter === 'all') {
            const statusWeight: Record<string, number> = {
                'pending': 1,
                'confirmed': 2,
                'completed': 3,
                'cancelled': 4
            };

            const weightA = statusWeight[a.status] || 5;
            const weightB = statusWeight[b.status] || 5;

            if (weightA !== weightB) {
                return weightA - weightB;
            }
        }

        // Secondary sort: Date Scheduled (Closest/Soonest first)
        // We use preferred_date to sort upcoming appointments first
        return new Date(a.preferred_date).getTime() - new Date(b.preferred_date).getTime();
    });

    const stats = {
        total: appointments.length,
        pending: appointments.filter(a => a.status === 'pending').length,
        confirmed: appointments.filter(a => a.status === 'confirmed').length,
        completed: appointments.filter(a => a.status === 'completed').length
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20">
                <div className="animate-spin w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <header className="mb-8">
                <h2 className="text-2xl font-bold text-slate-800">Gerenciar Agendamentos</h2>
                <p className="text-slate-500">Acompanhe as solicitações e o status de cada paciente.</p>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total</p>
                    <p className="text-3xl font-bold text-slate-800 mt-1">{stats.total}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <p className="text-xs text-yellow-500 font-bold uppercase tracking-wider">Pendentes</p>
                    <p className="text-3xl font-bold text-slate-800 mt-1">{stats.pending}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <p className="text-xs text-green-500 font-bold uppercase tracking-wider">Confirmados</p>
                    <p className="text-3xl font-bold text-slate-800 mt-1">{stats.confirmed}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <p className="text-xs text-blue-500 font-bold uppercase tracking-wider">Concluídos</p>
                    <p className="text-3xl font-bold text-slate-800 mt-1">{stats.completed}</p>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center sticky top-20 z-10">
                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap
                        ${filter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                    >
                        Todos
                    </button>
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap
                        ${filter === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'text-slate-600 hover:bg-slate-100'}`}
                    >
                        Pendentes
                    </button>
                    <button
                        onClick={() => setFilter('confirmed')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap
                        ${filter === 'confirmed' ? 'bg-green-100 text-green-700' : 'text-slate-600 hover:bg-slate-100'}`}
                    >
                        Confirmados
                    </button>
                    <button
                        onClick={() => setFilter('completed')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap
                        ${filter === 'completed' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`}
                    >
                        Concluídos
                    </button>
                </div>

                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por nome ou e-mail..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                    />
                </div>
            </div>

            {/* Appointments List */}
            <div className="space-y-4">
                {filteredAppointments.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100 dashed">
                        <p className="text-slate-400">Nenhum agendamento encontrado com os filtros atuais.</p>
                    </div>
                ) : (
                    filteredAppointments.map((app) => (
                        <div key={app.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                            <div className="flex flex-col lg:flex-row gap-6">
                                {/* Status Line Mobile */}
                                <div className={`h-1 w-full rounded-full lg:hidden
                                    ${app.status === 'confirmed' ? 'bg-green-500' :
                                        app.status === 'cancelled' ? 'bg-red-500' :
                                            app.status === 'completed' ? 'bg-blue-500' : 'bg-yellow-400'}`}
                                />

                                {/* Desktop Status Indicator */}
                                <div className={`hidden lg:block w-1.5 self-stretch rounded-full flex-shrink-0
                                    ${app.status === 'confirmed' ? 'bg-green-500' :
                                        app.status === 'cancelled' ? 'bg-red-500' :
                                            app.status === 'completed' ? 'bg-blue-500' : 'bg-yellow-400'}`}
                                />

                                <div className="flex-grow grid md:grid-cols-2 gap-6">
                                    {/* Main Info */}
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2 mb-3">
                                            <span className="text-xs font-bold text-slate-400">#{app.id}</span>
                                            <span className="text-xs text-slate-400">•</span>
                                            <span className="text-xs font-bold text-slate-400">{new Date(app.created_at).toLocaleDateString('pt-BR')}</span>

                                            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ml-auto md:ml-2
                                                ${app.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                    app.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                        app.status === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {app.status === 'pending' ? 'Pendente' :
                                                    app.status === 'confirmed' ? 'Confirmado' :
                                                        app.status === 'completed' ? 'Concluído' : 'Cancelado'}
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-bold text-slate-900 leading-tight">{app.child_name}</h3>
                                        <p className="text-slate-500 text-sm mb-4">Responsável: <span className="font-medium text-slate-700">{app.parent_name}</span></p>

                                        <div className="space-y-2 mt-4">
                                            <div className="flex items-center gap-3 text-slate-600 text-sm">
                                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-sky-600">
                                                    <User size={16} />
                                                </div>
                                                <span>{app.child_age} anos</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-slate-600 text-sm">
                                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-sky-600">
                                                    <Phone size={16} />
                                                </div>
                                                <span className="font-medium">{app.phone}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-slate-600 text-sm">
                                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-sky-600">
                                                    <Mail size={16} />
                                                </div>
                                                <span>{app.email}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Secondary Info */}
                                    <div className="pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-slate-50 md:pl-6">
                                        <div className="bg-sky-50 p-4 rounded-xl mb-4">
                                            <h4 className="font-bold text-sky-900 mb-1 text-xs uppercase tracking-wide flex items-center gap-2">
                                                <Calendar size={14} /> Preferência
                                            </h4>
                                            <p className="text-sky-950 font-bold">
                                                {new Date(app.preferred_date).toLocaleDateString('pt-BR')} <span className="font-normal text-sky-700">às</span> {app.preferred_time}
                                            </p>
                                        </div>

                                        <div>
                                            <h4 className="font-bold text-slate-400 mb-2 text-xs uppercase tracking-wide">Queixa Principal</h4>
                                            <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
                                                "{app.concern}"
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex lg:flex-col gap-2 justify-end lg:justify-start border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6 min-w-[140px]">
                                    {app.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => updateStatus(app.id, 'confirmed')}
                                                className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg font-bold transition-all shadow-sm hover:shadow-md text-sm"
                                            >
                                                <CheckCircle size={16} /> Confirmar
                                            </button>
                                            <button
                                                onClick={() => updateStatus(app.id, 'cancelled')}
                                                className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors text-sm"
                                            >
                                                <XCircle size={16} /> Cancelar
                                            </button>
                                        </>
                                    )}

                                    {app.status === 'confirmed' && (
                                        <>
                                            <button
                                                onClick={() => updateStatus(app.id, 'completed')}
                                                className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-bold transition-all shadow-sm text-sm"
                                            >
                                                <CheckCircle size={16} /> Concluir
                                            </button>
                                            <button
                                                onClick={() => updateStatus(app.id, 'cancelled')}
                                                className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors text-xs"
                                            >
                                                Cancelar
                                            </button>
                                        </>
                                    )}

                                    {(app.status === 'cancelled' || app.status === 'completed') && (
                                        <button
                                            onClick={() => updateStatus(app.id, 'pending')}
                                            className="w-full text-center text-slate-400 hover:text-sky-600 text-xs underline decoration-dotted mb-2"
                                        >
                                            Reabrir
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteAppointment(app.id)}
                                        className="w-full lg:flex-none flex items-center justify-center gap-2 px-4 py-2 mt-auto text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors text-xs border border-transparent hover:border-red-100"
                                    >
                                        <Trash2 size={14} /> Excluir
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
