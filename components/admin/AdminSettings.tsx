import React, { useState, useEffect } from 'react';
import { User, Clock, Shield, Save, Loader2, Plus, Trash2, Calendar, ChevronLeft, ChevronRight, XCircle, CheckCircle2 } from 'lucide-react';
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

const MONTHS_OF_YEAR = [
    { id: 0, name: 'Jan' },
    { id: 1, name: 'Fev' },
    { id: 2, name: 'Mar' },
    { id: 3, name: 'Abr' },
    { id: 4, name: 'Mai' },
    { id: 5, name: 'Jun' },
    { id: 6, name: 'Jul' },
    { id: 7, name: 'Ago' },
    { id: 8, name: 'Set' },
    { id: 9, name: 'Out' },
    { id: 10, name: 'Nov' },
    { id: 11, name: 'Dez' },
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
    const [availableMonths, setAvailableMonths] = useState<number[]>([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    const [availableTimes, setAvailableTimes] = useState<string[]>([]);
    const [newTime, setNewTime] = useState('');

    const [customSchedule, setCustomSchedule] = useState<Record<string, string[]>>({});

    // Custom Schedule Calendar State
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [selectedCustomDate, setSelectedCustomDate] = useState<string | null>(null);
    const [customNewTime, setCustomNewTime] = useState('');

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
                setAvailableMonths(data.available_months || [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
                setAvailableTimes(data.available_times || []);
                setCustomSchedule(data.custom_schedule || {});
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

            const { error } = await supabase
                .from('business_settings')
                .upsert({
                    id: 1,
                    available_days: availableDays,
                    available_months: availableMonths,
                    available_times: availableTimes.sort(),
                    custom_schedule: customSchedule
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

    const toggleMonth = (monthId: number) => {
        setAvailableMonths(prev =>
            prev.includes(monthId)
                ? prev.filter(id => id !== monthId)
                : [...prev, monthId].sort((a, b) => a - b)
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

    // Calendar Functions
    const handlePrevMonth = () => {
        if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
        else { setCurrentMonth(currentMonth - 1); }
    };
    const handleNextMonth = () => {
        if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
        else { setCurrentMonth(currentMonth + 1); }
    };

    const getTimesForDate = (dateStr: string, dayOfWeek: number, monthOfYear: number) => {
        if (customSchedule[dateStr] !== undefined) {
            return customSchedule[dateStr]; // Explicitly overridden
        }
        // Fallback to standard standard logic
        if (availableMonths.includes(monthOfYear) && availableDays.includes(dayOfWeek)) {
            return availableTimes;
        }
        return [];
    };

    const handleClearOverride = (dateStr: string) => {
        const newSched = { ...customSchedule };
        delete newSched[dateStr];
        setCustomSchedule(newSched);
    };

    const handleAddCustomTime = (dateStr: string) => {
        if (!customNewTime) return;
        const formattedTime = customNewTime.length === 5 ? customNewTime : customNewTime + ':00';

        setCustomSchedule(prev => {
            const newSched = { ...prev };
            // If the day wasn't overridden yet, initialize it with standard times before adding the new one
            if (newSched[dateStr] === undefined) {
                const dateObj = new Date(dateStr + 'T00:00:00');
                const standardTimes = getTimesForDate(dateStr, dateObj.getDay(), dateObj.getMonth());
                newSched[dateStr] = [...standardTimes];
            }
            if (!newSched[dateStr].includes(formattedTime)) {
                newSched[dateStr] = [...newSched[dateStr], formattedTime].sort();
            }
            return newSched;
        });
        setCustomNewTime('');
    };

    const handleRemoveCustomTime = (dateStr: string, time: string) => {
        setCustomSchedule(prev => {
            const newSched = { ...prev };
            if (newSched[dateStr] === undefined) {
                const dateObj = new Date(dateStr + 'T00:00:00');
                const standardTimes = getTimesForDate(dateStr, dateObj.getDay(), dateObj.getMonth());
                newSched[dateStr] = [...standardTimes];
            }
            newSched[dateStr] = newSched[dateStr].filter(t => t !== time);
            return newSched;
        });
    };

    const handleToggleCloseDay = (dateStr: string, currentlyClosed: boolean) => {
        setCustomSchedule(prev => {
            const newSched = { ...prev };
            if (currentlyClosed) {
                // Revert to standard
                delete newSched[dateStr];
            } else {
                // Close completely explicitly
                newSched[dateStr] = [];
            }
            return newSched;
        });
    };

    const renderCalendar = () => {
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const blanks = Array(firstDay).fill(null);
        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

        const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

        return (
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 shadow-inner mt-4">
                <div className="flex justify-between items-center mb-4">
                    <button type="button" onClick={handlePrevMonth} className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-600"><ChevronLeft size={18} /></button>
                    <div className="font-bold text-slate-800">{monthNames[currentMonth]} {currentYear}</div>
                    <button type="button" onClick={handleNextMonth} className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-600"><ChevronRight size={18} /></button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400 mb-2">
                    <div>Dom</div><div>Seg</div><div>Ter</div><div>Qua</div><div>Qui</div><div>Sex</div><div>Sáb</div>
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {blanks.map((_, i) => <div key={`blank-${i}`} className="p-2"></div>)}
                    {days.map(day => {
                        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const dateObj = new Date(currentYear, currentMonth, day);

                        const isSelected = selectedCustomDate === dateStr;
                        const times = getTimesForDate(dateStr, dateObj.getDay(), dateObj.getMonth());
                        const isAvailable = times.length > 0;
                        const isOverridden = customSchedule[dateStr] !== undefined;

                        return (
                            <button
                                key={day}
                                type="button"
                                onClick={() => setSelectedCustomDate(dateStr)}
                                className={`
                                    relative p-2 h-12 rounded-lg flex flex-col items-center justify-center transition-all border
                                    ${isSelected ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-105 z-10' : 'bg-white hover:bg-indigo-50 text-slate-700 border-slate-200'}
                                    ${isOverridden ? (!isSelected ? 'border-amber-400 bg-amber-50' : '') : ''}
                                `}
                            >
                                <span className={`text-sm ${isSelected ? 'font-bold' : ''}`}>{day}</span>
                                <div className="mt-1 absolute bottom-1.5 flex justify-center w-full">
                                    {isAvailable ? (
                                        <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-green-500'}`}></div>
                                    ) : (
                                        <XCircle size={10} className={isSelected ? "text-white opacity-50" : "text-red-400/50"} />
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
                <div className="flex items-center justify-center gap-4 text-xs text-slate-500 mt-4">
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500" /> Aberto Padrão</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 border border-amber-400 bg-amber-50" /> Modificado Customizado</span>
                </div>
            </div>
        );
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

                    {/* Months of year */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-slate-700 mb-3">Meses de Atendimento no Ano</label>
                        <div className="flex flex-wrap gap-2">
                            {MONTHS_OF_YEAR.map(month => {
                                const isSelected = availableMonths.includes(month.id);
                                return (
                                    <button
                                        key={month.id}
                                        onClick={() => toggleMonth(month.id)}
                                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${isSelected
                                            ? 'bg-sky-100 border-sky-200 text-sky-700'
                                            : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                                            }`}
                                    >
                                        {month.name}
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

            {/* Custom Schedule Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mt-6 lg:max-w-4xl max-w-full">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                        <Calendar size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800">Agendamento Específico por Dia</h3>
                        <p className="text-sm text-slate-500">Selecione dias no calendário para ignorar o padrão e definir horários pontuais.</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-start">
                    {/* Calendar View */}
                    <div>
                        {renderCalendar()}
                    </div>

                    {/* Manage Specifc Day logic */}
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 h-full">
                        {!selectedCustomDate ? (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400 text-center space-y-3 opacity-60">
                                <Calendar size={48} />
                                <p>Clique em um dia no calendário ao lado para gerenciar os horários exclusivos dele.</p>
                            </div>
                        ) : (() => {
                            const dateObj = new Date(selectedCustomDate + 'T00:00:00');
                            const dayOfWeek = dateObj.getDay();
                            const monthOfYear = dateObj.getMonth();

                            const isOverridden = customSchedule[selectedCustomDate] !== undefined;
                            const times = getTimesForDate(selectedCustomDate, dayOfWeek, monthOfYear);
                            const isClosed = times.length === 0;

                            const formatVisualDate = dateObj.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });

                            return (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-lg text-slate-800 capitalize leading-tight">
                                            {formatVisualDate}
                                        </h4>
                                    </div>

                                    <div className="flex items-center gap-2 mb-4">
                                        {isOverridden ? (
                                            <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded inline-flex items-center gap-1">
                                                Exceção Personalizada
                                            </span>
                                        ) : (
                                            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded inline-flex items-center gap-1">
                                                Seguindo o Padrão
                                            </span>
                                        )}
                                        {isClosed && (
                                            <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded">Fechado</span>
                                        )}
                                    </div>

                                    {/* Action Header */}
                                    <div className="flex flex-col gap-2 border-t border-slate-200 border-b py-3">
                                        {isOverridden ? (
                                            <button
                                                onClick={() => handleClearOverride(selectedCustomDate)}
                                                className="text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition"
                                            >
                                                Restaurar ao Padrão Global
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleToggleCloseDay(selectedCustomDate, false)}
                                                className="text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition"
                                            >
                                                <XCircle size={16} /> Fechar Agenda Deste Dia
                                            </button>
                                        )}
                                    </div>

                                    {/* Times manager for this day */}
                                    {!isClosed && (
                                        <>
                                            <p className="text-sm font-bold text-slate-700">Horários deste dia:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {times.map(time => (
                                                    <div key={time} className="flex items-center bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg overflow-hidden shrink-0">
                                                        <span className="px-3 py-1 text-sm font-medium">{time}</span>
                                                        <button
                                                            onClick={() => handleRemoveCustomTime(selectedCustomDate, time)}
                                                            className="p-1.5 hover:bg-indigo-300 transition-colors text-indigo-800"
                                                            title="Remover horário deste dia"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}

                                    {/* Add local time */}
                                    <div className="pt-2">
                                        <p className="text-sm font-bold text-slate-700 mb-2">Adicionar Horário Pontual Aqui:</p>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="time"
                                                value={customNewTime}
                                                onChange={(e) => setCustomNewTime(e.target.value)}
                                                className="px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-indigo-500 w-32"
                                            />
                                            <button
                                                onClick={() => handleAddCustomTime(selectedCustomDate)}
                                                className="bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition hover:bg-indigo-700 flex items-center gap-1"
                                            >
                                                <Plus size={16} /> Adicionar
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            );
                        })()}
                    </div>
                </div>
            </div>
        </div>
    );
};
