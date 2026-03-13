import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Calendar, Clock, Phone, Mail, User, CheckCircle, XCircle, Search, Filter, Trash2, List, X } from 'lucide-react';

interface PatientAnamnesis {
    id: number;
    created_at: string;
    answers: Record<string, any>;
}

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
    patient_id?: number;
}

export const AdminAppointments: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled' | 'completed'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    const [viewingAnamnesis, setViewingAnamnesis] = useState<PatientAnamnesis | null>(null);
    const [isAnamnesisModalOpen, setIsAnamnesisModalOpen] = useState(false);
    const [loadingAnamnesis, setLoadingAnamnesis] = useState(false);

    useEffect(() => {
        fetchAppointments();

        // Subscribe to changes on the appointments table
        const channel = supabase
            .channel('custom-all-channel')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'appointments' },
                (payload) => {
                    console.log('Change received!', payload);
                    fetchAppointments(); // Refresh the list
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
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
        console.log(`[Diagnostic] Updating appointment ${id} to status ${verifyStatus}...`);
        try {
            let currentPatientId = null;
            if (verifyStatus === 'confirmed' || verifyStatus === 'completed') {
                const appointment = appointments.find(app => app.id === id);
                if (appointment) {
                    console.log(`[Diagnostic] Appointment found: ${appointment.child_name}. Syncing patient...`);
                    currentPatientId = await handlePatientCreation(appointment);
                    console.log(`[Diagnostic] handlePatientCreation returned patient ID: ${currentPatientId}`);
                }
            }

            const updateData: any = { status: verifyStatus };
            if (currentPatientId) {
                updateData.patient_id = currentPatientId;
            }

            const { error } = await supabase
                .from('appointments')
                .update(updateData)
                .eq('id', id);

            if (error) {
                console.error('[Diagnostic] Supabase update error:', error);
                throw error;
            }

            console.log(`[Diagnostic] Update successful in DB. Updating local state...`);
            setAppointments(appointments.map(app =>
                app.id === id ? { ...app, ...updateData } : app
            ));
            
            if (verifyStatus === 'confirmed' || verifyStatus === 'completed') {
                if (currentPatientId) {
                    alert(`Agendamento confirmado! Paciente vinculado com sucesso (ID: ${currentPatientId}).`);
                } else {
                    alert('Agendamento confirmado, mas houve um problema ao vincular o paciente. Verifique o console do navegador (F12) para detalhes.');
                }
            }
        } catch (error: any) {
            console.error('[Diagnostic] Error in updateStatus:', error);
            alert(`Erro ao atualizar status: ${error.message || 'Erro desconhecido'}.`);
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

    const fetchAndShowAnamnesis = async (patientId?: number) => {
        if (!patientId) {
            alert('Este agendamento ainda não está vinculado a um paciente com ficha.');
            return;
        }
        setLoadingAnamnesis(true);
        try {
            const { data, error } = await supabase
                .from('patient_anamnesis')
                .select('*')
                .eq('patient_id', patientId)
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (error) throw error;
            if (data) {
                setViewingAnamnesis(data);
                setIsAnamnesisModalOpen(true);
            } else {
                alert('Nenhuma ficha de anamnese encontrada para este paciente.');
            }
        } catch (error) {
            console.error('Erro ao buscar anamnese:', error);
            alert('Erro ao carregar ficha de anamnese.');
        } finally {
            setLoadingAnamnesis(false);
        }
    };

    const handlePatientCreation = async (appointment: Appointment): Promise<number | null> => {
        try {
            console.log(`[Diagnostic] handlePatientCreation for ${appointment.child_name}, CPF: ${appointment.cpf}`);
            let existingPatientId = appointment.patient_id || null;

            if (!existingPatientId && appointment.cpf) {
                const { data, error } = await supabase
                    .from('patients')
                    .select('id')
                    .eq('cpf', appointment.cpf)
                    .maybeSingle();

                if (!error && data) {
                    existingPatientId = data.id;
                    console.log(`[Diagnostic] Found existing patient by CPF: ${existingPatientId}`);
                }
            }

            if (!existingPatientId) {
                const { data, error } = await supabase
                    .from('patients')
                    .select('id')
                    .eq('child_name', appointment.child_name)
                    .eq('parent_name', appointment.parent_name)
                    .maybeSingle();

                if (!error && data) {
                    existingPatientId = data.id;
                    console.log(`[Diagnostic] Found existing patient by Name Fallback: ${existingPatientId}`);
                }
            }

            if (!existingPatientId) {
                console.log(`[Diagnostic] No existing patient found. Creating new one...`);
                const { data: newPatient, error: insertError } = await supabase
                    .from('patients')
                    .insert({
                        child_name: appointment.child_name,
                        parent_name: appointment.parent_name,
                        phone: appointment.phone,
                        cpf: appointment.cpf,
                        email: appointment.email,
                        status: 'active',
                        notes: `Paciente criado automaticamente a partir do agendamento #${appointment.id}. Queixa: ${appointment.concern}`,
                    })
                    .select('id')
                    .single();

                if (insertError) {
                    console.error('[Diagnostic] Patient insert error:', insertError);
                    alert(`Aviso: Erro ao criar registro do paciente: ${insertError.message}. Verifique se a tabela 'patients' tem as colunas corretas.`);
                    return null;
                } else if (newPatient) {
                    console.log(`[Diagnostic] New patient created with ID: ${newPatient.id}`);
                    return newPatient.id;
                }
            } else {
                console.log(`[Diagnostic] Activating existing patient ID: ${existingPatientId}`);
                const { error: updateError } = await supabase
                    .from('patients')
                    .update({ status: 'active' })
                    .eq('id', existingPatientId);

                if (updateError) {
                    console.error('[Diagnostic] Error activating patient:', updateError);
                }
                return existingPatientId;
            }
        } catch (err: any) {
            console.error('[Diagnostic] Unexpected error in handlePatientCreation:', err);
        }
        return null;
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

                                        <h3
                                            className="text-xl font-bold text-sky-600 hover:text-sky-800 cursor-pointer leading-tight underline decoration-dotted underline-offset-4"
                                            onClick={() => fetchAndShowAnamnesis(app.patient_id)}
                                            title="Ver Ficha de Triagem"
                                        >
                                            {app.child_name} {app.patient_id && <List size={16} className="inline ml-1 mb-1" />}
                                        </h3>
                                        <p className="text-slate-500 text-sm mb-4 mt-1">Responsável: <span className="font-medium text-slate-700">{app.parent_name}</span></p>

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
                                                {(() => {
                                                    const datePart = app.preferred_date.substring(0, 10);
                                                    const [year, month, day] = datePart.split('-').map(Number);
                                                    return new Date(year, month - 1, day).toLocaleDateString('pt-BR');
                                                })()} <span className="font-normal text-sky-700">às</span> {app.preferred_time}
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

                                    {app.status === 'completed' && (
                                        <button
                                            onClick={() => updateStatus(app.id, 'pending')}
                                            className="w-full text-center text-slate-400 hover:text-sky-600 text-xs underline decoration-dotted mb-2"
                                        >
                                            Reabrir para pendente
                                        </button>
                                    )}
                                    {app.status === 'cancelled' && (
                                        <div className="w-full text-center text-red-500 text-xs font-bold mb-2 uppercase tracking-tight">
                                            Agendamento Cancelado
                                        </div>
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

            {/* Anamnesis Modal */}
            {isAnamnesisModalOpen && viewingAnamnesis && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 bg-sky-50 flex justify-between items-center flex-shrink-0">
                            <div>
                                <h3 className="font-bold text-sky-900 text-lg flex items-center gap-2">
                                    <List size={20} className="text-sky-600" />
                                    Respostas da Triagem Digital
                                </h3>
                                <p className="text-sm text-sky-700">Preenchido em: {new Date(viewingAnamnesis.created_at).toLocaleString('pt-BR')}</p>
                            </div>
                            <button onClick={() => setIsAnamnesisModalOpen(false)} className="p-2 hover:bg-sky-100 rounded-full text-sky-700 transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto">
                            <div className="grid gap-6 md:grid-cols-2">
                                {/* GESTÃO */}
                                <div className="space-y-4">
                                    <h4 className="font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs">1</div>
                                        Gestação e Nascimento
                                    </h4>
                                    <div className="grid gap-3">
                                        <div className="bg-slate-50 p-3 items-center rounded-lg border border-slate-100">
                                            <span className="block text-xs uppercase font-bold text-slate-400 mb-1">Como foi a gestação</span>
                                            <span className="font-medium text-slate-700">{viewingAnamnesis.answers.pregnancyType || '-'}</span>
                                        </div>
                                        <div className="bg-slate-50 p-3 items-center rounded-lg border border-slate-100">
                                            <span className="block text-xs uppercase font-bold text-slate-400 mb-1">Tipo de Parto</span>
                                            <span className="font-medium text-slate-700">{viewingAnamnesis.answers.birthType || '-'}</span>
                                        </div>
                                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                            <span className="block text-xs uppercase font-bold text-slate-400 mb-1">Complicações</span>
                                            <span className="text-slate-700">{viewingAnamnesis.answers.birthComplications || '-'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* DESENVOLVIMENTO */}
                                <div className="space-y-4">
                                    <h4 className="font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs">2</div>
                                        Desenvolvimento
                                    </h4>
                                    <div className="grid gap-3">
                                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                            <span className="block text-xs uppercase font-bold text-slate-400 mb-1">Motor (Andou/Engatinhou)</span>
                                            <span className="font-medium text-slate-700">{viewingAnamnesis.answers.motorDevelopment || '-'}</span>
                                        </div>
                                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                            <span className="block text-xs uppercase font-bold text-slate-400 mb-1">Desenvolvimento da Fala</span>
                                            <span className="font-medium text-slate-700">{viewingAnamnesis.answers.speechDevelopment || '-'}</span>
                                        </div>
                                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                            <span className="block text-xs uppercase font-bold text-slate-400 mb-1">Desfralde</span>
                                            <span className="font-medium text-slate-700">{viewingAnamnesis.answers.sphincterControl || '-'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* ESCOLA */}
                                <div className="space-y-4 md:col-span-2">
                                    <h4 className="font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs">3</div>
                                        Vida Escolar
                                    </h4>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="grid gap-3">
                                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                                <span className="block text-xs uppercase font-bold text-slate-400 mb-1">Escola Atual</span>
                                                <span className="font-medium text-slate-700">{viewingAnamnesis.answers.schoolName || '-'}</span>
                                            </div>
                                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                                <span className="block text-xs uppercase font-bold text-slate-400 mb-1">Série / Ano</span>
                                                <span className="font-medium text-slate-700">{viewingAnamnesis.answers.currentGrade || '-'}</span>
                                            </div>
                                        </div>
                                        <div className="grid gap-3">
                                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                                <span className="block text-xs uppercase font-bold text-slate-400 mb-1">Desempenho</span>
                                                <span className="text-slate-700 italic">"{viewingAnamnesis.answers.schoolPerformance || '-'}"</span>
                                            </div>
                                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                                <span className="block text-xs uppercase font-bold text-slate-400 mb-1">Comportamento na Lição C/ Casa</span>
                                                <span className="text-slate-700 italic">"{viewingAnamnesis.answers.homeworkBehavior || '-'}"</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* SAÚDE / OUTROS */}
                                <div className="space-y-4 md:col-span-2">
                                    <h4 className="font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">4</div>
                                        Saúde e Observações Livres
                                    </h4>
                                    <div className="grid md:grid-cols-3 gap-4 mb-3">
                                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                            <span className="block text-xs uppercase font-bold text-slate-400 mb-1">Qualidade do Sono</span>
                                            <span className="text-slate-700">{viewingAnamnesis.answers.sleepQuality || '-'}</span>
                                        </div>
                                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                            <span className="block text-xs uppercase font-bold text-slate-400 mb-1">Alimentação</span>
                                            <span className="text-slate-700">{viewingAnamnesis.answers.eatingHabits || '-'}</span>
                                        </div>
                                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                            <span className="block text-xs uppercase font-bold text-slate-400 mb-1">Medicamentos / Alergias</span>
                                            <span className="text-slate-700">{viewingAnamnesis.answers.allergiesOrMedications || '-'}</span>
                                        </div>
                                    </div>
                                    {viewingAnamnesis.answers.additionalNotes && (
                                        <div className="bg-sky-50 p-4 rounded-xl border border-sky-100 text-sky-900">
                                            <span className="block text-xs uppercase font-bold text-sky-700 mb-2">Informações Adicionais Fornecidas</span>
                                            <p className="italic">"{viewingAnamnesis.answers.additionalNotes}"</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
