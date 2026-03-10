import React, { useState, useEffect } from 'react';
import { User, Clock, Shield, Save, Loader2, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

// Helper for days
const DAYS_OF_WEEK = [
    { id: 0, name: 'Domingo' },
    { id: 1, name: 'Segunda' },
    { id: 2, name: 'Terça' },
    { id: 3, name: 'Quarta' },
    { id: 4, name: 'Quinta' },
    { id: 5, name: 'Sexta' },
    { id: 6, name: 'Sábado' },
];

export const AdminSettings: React.FC = () => {
    const { user } = useAuth();

    // Settings state
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Data state
    const [availableDays, setAvailableDays] = useState<number[]>([]);
    const [availableTimes, setAvailableTimes] = useState<string[]>([]);
    const [newTime, setNewTime] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('business_settings')
                .select('*')
                .eq('id', 1)
                .single();

            if (error) {
                if (error.code !== 'PGRST116') // Not found is okay, we will insert on save
                    throw error;
            } else if (data) {
                setAvailableDays(data.available_days || []);
                setAvailableTimes(data.available_times || []);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
            setErrorMessage('Erro ao carregar configurações.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            setSuccessMessage('');
            setErrorMessage('');

            // Upsert the settings
            const { error } = await supabase
                .from('business_settings')
                .upsert({
                    id: 1,
                    available_days: availableDays,
                    available_times: availableTimes.sort() // keep times sorted
                });

            if (error) throw error;
            setSuccessMessage('Configurações salvas com sucesso!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Error saving settings:', error);
            setErrorMessage('Erro ao salvar opções. Tente novamente.');
        } finally {
            setIsSaving(false);
        }
    };

    const toggleDay = (dayId: number) => {
        setAvailableDays(prev =>
            prev.includes(dayId)
                ? prev.filter(id => id !== dayId)
                : [...prev, dayId].sort()
        );
    };

    const addTime = () => {
        if (!newTime) return;

        // Ensure format HH:mm
        const formattedTime = newTime.length === 5 ? newTime : newTime + ':00';

        if (!availableTimes.includes(formattedTime)) {
            setAvailableTimes(prev => [...prev, formattedTime].sort());
        }
        setNewTime('');
    };

    const removeTime = (timeToRemove: string) => {
        setAvailableTimes(prev => prev.filter(t => t !== timeToRemove));
    };

    if (isLoading) {
        return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-sky-600" size={32} /></div>;
    }

    return (
        <div className="space-y-6">
            <header className="mb-8 flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Ajustes & Configurações</h2>
                    <p className="text-slate-500">Gerencie seu perfil e regras de agendamento.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-sky-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-sky-700 transition disabled:opacity-50"
                >
                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    Salvar Alterações
                </button>
            </header>

            {successMessage && (
                <div className="bg-emerald-50 text-emerald-600 px-4 py-3 rounded-lg border border-emerald-100 flex items-center mb-6">
                    {successMessage}
                </div>
            )}

            {errorMessage && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg border border-red-100 flex items-center mb-6">
                    {errorMessage}
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
                {/* Profile Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center text-sky-600">
                            <User size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">Perfil do Usuário</h3>
                            <p className="text-sm text-slate-500">Informações da sua conta de administrador</p>
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
                            <span>Acesso Administrativo Autorizado</span>
                        </div>
                    </div>
                </div>

                {/* Scheduling Settings */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                            <Clock size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">Disponibilidade de Agenda</h3>
                            <p className="text-sm text-slate-500">Controle regras do formulário de marcação</p>
                        </div>
                    </div>

                    {/* Days of week */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-slate-700 mb-3">Dias de Atendimento na Semana</label>
                        <div className="flex flex-wrap gap-2">
                            {DAYS_OF_WEEK.map(day => {
                                const isSelected = availableDays.includes(day.id);
                                return (
                                    <button
                                        key={day.id}
                                        onClick={() => toggleDay(day.id)}
                                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${isSelected
                                                ? 'bg-purple-100 border-purple-200 text-purple-700'
                                                : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                                            }`}
                                    >
                                        {day.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Timeslots */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-3">Grade de Horários</label>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {availableTimes.map(time => (
                                <div key={time} className="flex items-center bg-sky-50 border border-sky-100 text-sky-700 rounded-lg overflow-hidden">
                                    <span className="px-3 py-1 text-sm font-medium">{time}</span>
                                    <button
                                        onClick={() => removeTime(time)}
                                        className="p-1.5 hover:bg-sky-200 transition-colors text-sky-600"
                                        title="Remover horário"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                            {availableTimes.length === 0 && (
                                <span className="text-sm text-slate-400 italic">Nenhum horário cadastrado.</span>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="time"
                                value={newTime}
                                onChange={(e) => setNewTime(e.target.value)}
                                className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                            />
                            <button
                                onClick={addTime}
                                className="bg-slate-800 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1 hover:bg-slate-700 transition"
                            >
                                <Plus size={16} /> Adicionar
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
