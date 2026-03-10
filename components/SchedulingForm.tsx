import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Calendar, Clock, Loader2, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

// Schema base sem a validação dinâmica de dia, pois faremos isso no superRefine ou no component
const baseSchedulingSchema = z.object({
    parentName: z.string().min(2, 'Nome do responsável é obrigatório'),
    childName: z.string().min(2, 'Nome da criança é obrigatório'),
    childAge: z.coerce.number()
        .min(1, 'Idade inválida')
        .max(18, 'Idade deve ser entre 0 e 18 anos'),
    cpf: z.string()
        .min(11, 'CPF incompleto')
        .max(14, 'CPF inválido')
        .regex(/^\d{3}\.?\d{3}\.?\d{3}\-?\d{2}$/, 'Formato inválido. Use 000.000.000-00'),
    email: z.string().email('E-mail inválido'),
    phone: z.string()
        .min(10, 'Telefone inválido')
        .regex(/^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})\-?(\d{4}))$/, 'Formato inválido. Use (DD) 99999-9999'),
    concern: z.string().min(10, 'Descreva brevemente a queixa ou motivo do agendamento'),
    date: z.string().refine((val) => {
        const selectedDate = new Date(val + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today;
    }, 'A data não pode ser anterior a hoje'),
    time: z.string().min(1, 'Selecione um horário'),
});

type SchedulingData = z.infer<typeof baseSchedulingSchema>;

interface SchedulingFormProps {
    onSuccess: (patientId: number | null) => void;
    onCancel: () => void;
}

export const SchedulingForm: React.FC<SchedulingFormProps> = ({ onSuccess, onCancel }) => {
    // Configurações dinâmicas
    const [isLoadingSettings, setIsLoadingSettings] = useState(true);
    const [availableDays, setAvailableDays] = useState<number[]>([6]); // default Sabado
    const [availableTimes, setAvailableTimes] = useState<string[]>([]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [bookedTimes, setBookedTimes] = useState<string[]>([]);
    const [isFetchingTimes, setIsFetchingTimes] = useState(false);

    // Dynamic Schema that uses state
    const schedulingSchema = baseSchedulingSchema.superRefine((data, ctx) => {
        // Validação 1: Dia da Semana
        if (data.date) {
            const selectedDate = new Date(data.date + 'T00:00:00');
            const dayOfWeek = selectedDate.getDay();

            if (!availableDays.includes(dayOfWeek)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "A clínica não atende neste dia da semana.",
                    path: ["date"]
                });
            }
        }

        // Validação 2: Horário no passado se for hoje
        if (data.date && data.time) {
            const selectedDate = new Date(data.date + 'T00:00:00');
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate.getTime() === today.getTime()) {
                const [hours, minutes] = data.time.split(':').map(Number);
                const now = new Date();
                const selectedTime = new Date();
                selectedTime.setHours(hours, minutes, 0, 0);

                if (selectedTime <= now) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "O horário selecionado já passou.",
                        path: ["time"]
                    });
                }
            }
        }
    });

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        clearErrors,
        formState: { errors },
    } = useForm<SchedulingData>({
        resolver: zodResolver(schedulingSchema),
        defaultValues: {
            parentName: '',
            childName: '',
            childAge: undefined as any,
            cpf: '',
            email: '',
            phone: '',
            concern: '',
            date: '',
            time: ''
        }
    });

    const watchedDate = watch('date');
    const selectedTime = watch('time');

    // Mudar para buscar configurações globais
    useEffect(() => {
        const loadBusinessSettings = async () => {
            try {
                // Buscamos a tabela business_settings (id=1 é a padrão que criamos)
                const { data, error } = await supabase
                    .from('business_settings')
                    .select('*')
                    .eq('id', 1)
                    .single();

                if (data) {
                    setAvailableDays(data.available_days || [6]); // Fallback Sabado
                    setAvailableTimes(data.available_times || []);
                }
            } catch (err) {
                console.error("Erro ao carregar configurações:", err);
            } finally {
                setIsLoadingSettings(false);
            }
        };

        loadBusinessSettings();
    }, []);

    // Buscar horários ocupados para a data selecionada
    useEffect(() => {
        const fetchBookedTimes = async () => {
            if (!watchedDate) {
                setBookedTimes([]);
                return;
            }

            setIsFetchingTimes(true);
            try {
                const { data, error } = await supabase
                    .from('appointments')
                    .select('preferred_time, status')
                    .eq('preferred_date', watchedDate);

                if (error) {
                    console.error('Erro ao buscar horários:', error);
                    return;
                }

                // Filtrar cancelados/recusados
                const booked = data
                    .filter(app => app.status !== 'cancelled' && app.status !== 'rejected')
                    .map(app => app.preferred_time.substring(0, 5));

                setBookedTimes(booked);

                // Limpar seleção se o horário que o user clicou ficou ocupado
                if (selectedTime && booked.includes(selectedTime)) {
                    setValue('time', '', { shouldValidate: true });
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsFetchingTimes(false);
            }
        };

        fetchBookedTimes();
    }, [watchedDate]);

    const onSubmit = async (data: SchedulingData) => {
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const cleanCpf = data.cpf.replace(/\D/g, '');

            // 1. Marketing Leads Capture (To trigger Make / E-mail campaigns)
            const { error: marketingError } = await supabase
                .from('marketing_leads')
                .insert([{
                    parent_name: data.parentName,
                    email: data.email,
                    phone: data.phone,
                    source: 'website_scheduling'
                }]);

            if (marketingError) {
                console.error("Erro sútil ao salvar lead de marketing:", marketingError);
                // Não bloquear o agendamento se apenas o lead falhar
            }

            // 2. Create Clinical Patient (Required to link Anamnesis & Appointments)
            let patientId = null;

            // Check if clinical patient exists by CPF
            const { data: existingPatient, error: searchError } = await supabase
                .from('patients')
                .select('id')
                .eq('cpf', cleanCpf)
                .maybeSingle();

            if (searchError && searchError.code !== 'PGRST116') {
                throw searchError;
            }

            if (existingPatient) {
                patientId = existingPatient.id;
            } else {
                // Insert new patient as prospect (Will be updated when anamnesis finishes)
                const { data: newPatient, error: insertPatientError } = await supabase
                    .from('patients')
                    .insert([{
                        child_name: data.childName,
                        parent_name: data.parentName,
                        phone: data.phone,
                        email: data.email,
                        cpf: cleanCpf,
                        status: 'prospect'
                    }])
                    .select('id')
                    .single();

                if (insertPatientError) throw insertPatientError;
                if (newPatient) patientId = newPatient.id;
            }

            // 3. Create Appointment Request
            const { error: appointmentError } = await supabase
                .from('appointments')
                .insert([
                    {
                        parent_name: data.parentName,
                        child_name: data.childName,
                        child_age: data.childAge,
                        cpf: cleanCpf,
                        email: data.email,
                        phone: data.phone,
                        concern: data.concern,
                        preferred_date: data.date,
                        preferred_time: data.time,
                        status: 'pending',
                        patient_id: patientId
                    },
                ]);

            if (appointmentError) throw appointmentError;

            // Pass the clinical patientId back so the Modal knows to open the Anamnesis step
            onSuccess(patientId);
        } catch (error) {
            console.error('Erro ao agendar:', error);
            // @ts-ignore
            setSubmitError(error?.message ? `Erro: ${error.message}` : 'Ocorreu um erro ao realizar o agendamento.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const todayStr = new Date().toISOString().split('T')[0];

    const handleTimeSelect = (time: string) => {
        if (!bookedTimes.includes(time)) {
            setValue('time', time);
            clearErrors('time');
        }
    };

    if (isLoadingSettings) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500 gap-3">
                <Loader2 className="animate-spin text-sky-600" size={32} />
                <p className="text-sm font-medium">Carregando horários da clínica...</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {submitError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm">
                    <AlertCircle size={16} />
                    {submitError}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Responsável</label>
                    <input
                        {...register('parentName')}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                        placeholder="Seu nome completo"
                    />
                    {errors.parentName && <span className="text-xs text-red-500">{errors.parentName.message}</span>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">CPF do Responsável</label>
                    <input
                        {...register('cpf')}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                        placeholder="000.000.000-00"
                        maxLength={14}
                    />
                    {errors.cpf && <span className="text-xs text-red-500">{errors.cpf.message}</span>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
                    <input
                        {...register('email')}
                        type="email"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                        placeholder="seu@email.com"
                    />
                    {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Telefone / WhatsApp</label>
                    <input
                        {...register('phone')}
                        type="tel"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                        placeholder="(00) 00000-0000"
                    />
                    {errors.phone && <span className="text-xs text-red-500">{errors.phone.message}</span>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nome da Criança</label>
                        <input
                            {...register('childName')}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                            placeholder="Nome da criança"
                        />
                        {errors.childName && <span className="text-xs text-red-500">{errors.childName.message}</span>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Idade</label>
                        <input
                            {...register('childAge')}
                            type="number"
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                            placeholder="Anos"
                        />
                        {errors.childAge && <span className="text-xs text-red-500">{errors.childAge.message}</span>}
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Queixa Principal / Motivo</label>
                <textarea
                    {...register('concern')}
                    rows={3}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Descreva brevemente o motivo do agendamento..."
                />
                {errors.concern && <span className="text-xs text-red-500">{errors.concern.message}</span>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                        <Calendar size={16} /> Data Preferencial
                    </label>
                    <input
                        {...register('date')}
                        type="date"
                        min={todayStr}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                    />
                    {errors.date && <span className="text-xs text-red-500">{errors.date.message}</span>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center justify-between">
                        <span className="flex items-center gap-2"><Clock size={16} /> Horário</span>
                        {isFetchingTimes && <Loader2 size={14} className="animate-spin text-sky-600" />}
                    </label>

                    {watchedDate ? (
                        <div className="space-y-3">
                            {availableTimes.length > 0 ? (
                                <div className="grid grid-cols-3 gap-2">
                                    {availableTimes.map(time => {
                                        const isBooked = bookedTimes.includes(time);
                                        const isSelected = selectedTime === time;

                                        return (
                                            <button
                                                key={time}
                                                type="button"
                                                disabled={isBooked}
                                                onClick={() => handleTimeSelect(time)}
                                                className={`
                                                    relative flex items-center justify-center py-2 px-1 rounded-lg border text-sm font-medium transition-all
                                                    ${isBooked
                                                        ? 'bg-red-50 border-red-200 text-red-400 cursor-not-allowed'
                                                        : isSelected
                                                            ? 'bg-sky-600 border-sky-600 text-white shadow-md'
                                                            : 'bg-white border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300'
                                                    }
                                                `}
                                            >
                                                {isBooked ? (
                                                    <span className="flex items-center gap-1"><XCircle size={14} /> {time}</span>
                                                ) : (
                                                    <span className="flex items-center gap-1">
                                                        {isSelected ? <CheckCircle2 size={14} /> : <div className="w-2 h-2 rounded-full bg-green-500 mr-1" />}
                                                        {time}
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="p-4 border border-slate-200 bg-slate-50 rounded-lg text-sm text-center text-slate-500">
                                    Nenhum horário disponível configurado na clínica.
                                </div>
                            )}

                            {/* Legenda (só mostrar se tiver horários configurados) */}
                            {availableTimes.length > 0 && (
                                <div className="flex items-center justify-center gap-4 text-xs text-slate-500 bg-slate-50 p-2 rounded-md border border-slate-100">
                                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500" /> Livre</span>
                                    <span className="flex items-center gap-1"><XCircle size={10} className="text-red-400" /> Ocupado</span>
                                    <span className="flex items-center gap-1"><CheckCircle2 size={10} className="text-sky-600" /> Selecionado</span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-[100px] flex items-center justify-center border-2 border-dashed border-slate-200 rounded-lg bg-slate-50 text-slate-400 text-sm italic">
                            Selecione uma data primeiro
                        </div>
                    )}

                    {/* Input hidden só para o react-hook-form registrar o valor final */}
                    <input type="hidden" {...register('time')} />

                    {errors.time && <span className="text-xs text-red-500 inline-block mt-1">{errors.time.message}</span>}
                </div>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-2 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors font-medium"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition-all font-medium shadow-md active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Agendando...
                        </>
                    ) : (
                        'Confirmar Agendamento'
                    )}
                </button>
            </div>
        </form>
    );
};
