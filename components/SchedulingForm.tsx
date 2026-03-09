
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Calendar, Clock, Loader2, AlertCircle } from 'lucide-react';

// Schema de validação
const schedulingSchema = z.object({
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
    // Date and time validation
    date: z.string().refine((val) => {
        const selectedDate = new Date(val + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today;
    }, 'A data não pode ser anterior a hoje')
        .refine((val) => {
            const selectedDate = new Date(val + 'T00:00:00');
            const dayOfWeek = selectedDate.getDay();
            // Permitir APENAS sábados (6)
            return dayOfWeek === 6;
        }, 'Atendimentos ocorrem apenas aos Sábados'),
    time: z.string().min(1, 'Selecione um horário'),
}).refine((data) => {
    // Validar se data é hoje, o horário já passou
    const selectedDate = new Date(data.date + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate.getTime() === today.getTime()) {
        const [hours, minutes] = data.time.split(':').map(Number);
        const now = new Date();
        const selectedTime = new Date();
        selectedTime.setHours(hours, minutes, 0, 0);
        return selectedTime > now;
    }
    return true;
}, {
    message: "O horário selecionado já passou",
    path: ["time"] // O erro aparecerá no campo 'time'
});

// Infer type from schema
type SchedulingData = z.infer<typeof schedulingSchema>;

interface SchedulingFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export const SchedulingForm: React.FC<SchedulingFormProps> = ({ onSuccess, onCancel }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
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

    const onSubmit = async (data: SchedulingData) => {
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            // Remove formatting from CPF for storage (optional, but good practice)
            const cleanCpf = data.cpf.replace(/\D/g, '');

            const { error } = await supabase
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
                        status: 'pending'
                    },
                ]);

            if (error) throw error;

            // Sucesso
            onSuccess();
        } catch (error) {
            console.error('Erro ao agendar:', error);
            // @ts-ignore
            setSubmitError(error?.message ? `Erro: ${error.message}` : 'Ocorreu um erro ao realizar o agendamento. Tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Data mínima permitida (hoje) no formato YYYY-MM-DD
    const todayStr = new Date().toISOString().split('T')[0];

    // Horários disponíveis limitados (Sábados, 09h às 11h e 14h às 16h)
    const availableTimes = [
        "09:00", "10:00", "11:00", "14:00", "15:00", "16:00"
    ];

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
                    <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                        <Clock size={16} /> Horário
                    </label>
                    <select
                        {...register('time')}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all bg-white"
                    >
                        <option value="">Selecione...</option>
                        {availableTimes.map(time => (
                            <option key={time} value={time}>{time}</option>
                        ))}
                    </select>
                    {errors.time && <span className="text-xs text-red-500">{errors.time.message}</span>}
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
