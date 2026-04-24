import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, AlertCircle, CheckCircle2, FileText, ChevronRight, Check, User } from 'lucide-react';

const anamnesisSchema = z.object({
    // Gestação e Nascimento
    pregnancyType: z.string().min(1, 'Campo obrigatório'),
    birthType: z.string().min(1, 'Campo obrigatório'),
    birthComplications: z.string().min(1, 'Campo obrigatório'),

    // Desenvolvimento
    motorDevelopment: z.string().min(1, 'Campo obrigatório'),
    speechDevelopment: z.string().min(1, 'Campo obrigatório'),
    sphincterControl: z.string().min(1, 'Campo obrigatório'),

    // Saúde
    sleepQuality: z.string().min(1, 'Campo obrigatório'),
    eatingHabits: z.string().min(1, 'Campo obrigatório'),
    allergiesOrMedications: z.string().min(1, 'Campo obrigatório'),

    // Escolaridade
    schoolName: z.string().min(2, 'Nome da escola escolar'),
    currentGrade: z.string().min(1, 'Campo obrigatório'),
    schoolPerformance: z.string().min(1, 'Como você avalia o desempenho escolar?'),
    homeworkBehavior: z.string().min(1, 'Como é o comportamento durante a lição?'),

    // Observações Especiais
    additionalNotes: z.string().min(1, 'Campo obrigatório')
});

type AnamnesisData = z.infer<typeof anamnesisSchema>;

interface AnamnesisFormProps {
    patientId: number | null;
    onSuccess: () => void;
    onSkip: () => void;
}

export const AnamnesisForm: React.FC<AnamnesisFormProps> = ({ patientId, onSuccess, onSkip }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AnamnesisData>({
        resolver: zodResolver(anamnesisSchema),
        defaultValues: {
            pregnancyType: '',
            birthType: '',
            birthComplications: '',
            motorDevelopment: '',
            speechDevelopment: '',
            sphincterControl: '',
            sleepQuality: '',
            eatingHabits: '',
            allergiesOrMedications: '',
            schoolName: '',
            currentGrade: '',
            schoolPerformance: '',
            homeworkBehavior: '',
            additionalNotes: ''
        }
    });

    const onSubmit = async (data: AnamnesisData) => {
        if (!patientId) {
            setSubmitError('ID do paciente não encontrado. O agendamento parece estar incompleto.');
            return;
        }

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            // Inserir JSONB no Supabase
            const { error } = await supabase
                .from('patient_anamnesis')
                .insert([
                    {
                        patient_id: patientId,
                        answers: data
                    }
                ]);

            if (error) throw error;
            onSuccess();
        } catch (error: any) {
            console.error('Erro ao salvar anamnese:', error);
            setSubmitError(error?.message || 'Ocorreu um erro ao salvar o formulário.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">

            <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 mb-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 transform translate-x-10 -translate-y-10"></div>
                <h4 className="font-bold text-sky-900 flex items-center gap-2 mb-2 text-lg">
                    <CheckCircle2 className="text-sky-600" size={24} />
                    Agendamento Confirmado!
                </h4>
                <p className="text-sm text-sky-800 relative z-10">
                    Você já garantiu seu horário na clínica. Para adiantarmos a análise e oferecermos o melhor acolhimento, pedimos que preencha a ficha de anamnese abaixo.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {submitError && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm font-medium">
                        <AlertCircle size={16} />
                        {submitError}
                    </div>
                )}

                {/* Categoria 1: Gestação e Nascimento */}
                <section className="space-y-4">
                    <h5 className="font-bold text-slate-800 text-lg border-b pb-2 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm">1</div>
                        Gestação e Nascimento
                    </h5>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Como foi a gestação? *</label>
                            <select {...register('pregnancyType')} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 bg-white">
                                <option value="">Selecione...</option>
                                <option value="Tranquila">Tranquila</option>
                                <option value="De risco">De risco</option>
                                <option value="Prematuro">Prematuro</option>
                            </select>
                            {errors.pregnancyType && <span className="text-xs text-red-500">{errors.pregnancyType.message}</span>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Parto *</label>
                            <select {...register('birthType')} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 bg-white">
                                <option value="">Selecione...</option>
                                <option value="Normal">Normal</option>
                                <option value="Cesárea">Cesárea</option>
                                <option value="Fórceps">Fórceps</option>
                            </select>
                            {errors.birthType && <span className="text-xs text-red-500">{errors.birthType.message}</span>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Houve alguma complicação no parto/pós-parto? *</label>
                        <input {...register('birthComplications')} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500" placeholder="Ex: Icterícia, UTI Neonatal, Nenhuma..." />
                        {errors.birthComplications && <span className="text-xs text-red-500">{errors.birthComplications.message}</span>}
                    </div>
                </section>

                {/* Categoria 2: Desenvolvimento Infantil */}
                <section className="space-y-4">
                    <h5 className="font-bold text-slate-800 text-lg border-b pb-2 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">2</div>
                        Desenvolvimento Infantil
                    </h5>

                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Engatinhou e Andou no tempo esperado? *</label>
                            <select {...register('motorDevelopment')} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 bg-white">
                                <option value="">Selecione...</option>
                                <option value="Sim, dentro do esperado">Sim</option>
                                <option value="Atraso motor">Teve certo atraso</option>
                                <option value="Pulou etapas">Pulou etapas (ex: não engatinhou)</option>
                            </select>
                            {errors.motorDevelopment && <span className="text-xs text-red-500">{errors.motorDevelopment.message}</span>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Desenvolvimento da Fala *</label>
                            <select {...register('speechDevelopment')} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 bg-white">
                                <option value="">Selecione...</option>
                                <option value="Normal">Normal</option>
                                <option value="Atraso na fala">Atraso para começar a falar</option>
                                <option value="Troca letras">Fala, mas troca letras</option>
                            </select>
                            {errors.speechDevelopment && <span className="text-xs text-red-500">{errors.speechDevelopment.message}</span>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Desfralde Diurno e Noturno *</label>
                            <select {...register('sphincterControl')} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 bg-white">
                                <option value="">Selecione...</option>
                                <option value="No tempo esperado">Tranquilo, no tempo esperado</option>
                                <option value="Tardio / Dificuldade">Tardio / Dificuldade</option>
                                <option value="Ainda usa fralda">Ainda usa fralda / escapes</option>
                            </select>
                            {errors.sphincterControl && <span className="text-xs text-red-500">{errors.sphincterControl.message}</span>}
                        </div>
                    </div>
                </section>

                {/* Categoria 3: Vida Escolar */}
                <section className="space-y-4">
                    <h5 className="font-bold text-slate-800 text-lg border-b pb-2 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm">3</div>
                        Vida Escolar
                    </h5>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nome da Escola *</label>
                            <input {...register('schoolName')} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500" placeholder="Onde estuda atualmente?" />
                            {errors.schoolName && <span className="text-xs text-red-500">{errors.schoolName.message}</span>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Série / Ano atual *</label>
                            <input {...register('currentGrade')} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500" placeholder="Ex: 3º ano do Fundamental" />
                            {errors.currentGrade && <span className="text-xs text-red-500">{errors.currentGrade.message}</span>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Como você e a escola avaliam o desempenho e comportamento escolar? *</label>
                        <textarea {...register('schoolPerformance')} rows={2} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 resize-none" placeholder="Relatos dos professores, facilidades e dificuldades gerais..." />
                        {errors.schoolPerformance && <span className="text-xs text-red-500">{errors.schoolPerformance.message}</span>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Como é o momento da Lição de Casa? *</label>
                        <textarea {...register('homeworkBehavior')} rows={2} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 resize-none" placeholder="Faz sozinho? Precisa de muita ajuda? Demora muito? Tem resistência?" />
                        {errors.homeworkBehavior && <span className="text-xs text-red-500">{errors.homeworkBehavior.message}</span>}
                    </div>
                </section>

                {/* Categoria 4: Outras Observações */}
                <section className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Sono *</label>
                            <input {...register('sleepQuality')} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500" placeholder="Ex: Dorme bem, agitado, insônia..." />
                            {errors.sleepQuality && <span className="text-xs text-red-500">{errors.sleepQuality.message}</span>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Alimentação *</label>
                            <input {...register('eatingHabits')} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500" placeholder="Ex: Come de tudo, seletivo..." />
                            {errors.eatingHabits && <span className="text-xs text-red-500">{errors.eatingHabits.message}</span>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Toma algum medicamento de uso contínuo ou tem alergia? *</label>
                        <input {...register('allergiesOrMedications')} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500" placeholder="Especificar..." />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Há mais alguma coisa que gostaria de me contar antes da nossa consulta? *</label>
                        <textarea {...register('additionalNotes')} rows={3} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 resize-none" placeholder="Informação adicional sobre rotina, lutos, divórcio dos pais, etc..." />
                    </div>
                </section>

                {/* Botões */}
                <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-slate-200">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-all font-medium shadow-md active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Check size={18} />
                        )}
                        {isSubmitting ? 'Enviando Ficha...' : 'Concluir Agendamento e Enviar'}
                    </button>
                </div>
            </form>
        </div>
    );
};
