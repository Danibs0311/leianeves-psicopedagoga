import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { SchedulingForm } from './SchedulingForm';
import { AnamnesisForm } from './AnamnesisForm';

interface SchedulingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SchedulingModal: React.FC<SchedulingModalProps> = ({ isOpen, onClose }) => {
    // Step 1: Basic Info & Schedule | Step 2: Anamnesis Triage
    const [step, setStep] = useState<1 | 2>(1);
    const [createdPatientId, setCreatedPatientId] = useState<number | null>(null);

    // Reset state when modal closes/opens
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setStep(1);
            setCreatedPatientId(null);
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSchedulingSuccess = (patientId: number | null) => {
        setCreatedPatientId(patientId);
        setStep(2); // Vai para a tela de Anamnese
    };

    const handleFinalSuccess = () => {
        alert('Agendamento e ficha recebidos com sucesso! Entraremos em contato em breve.');
        onClose();
    };

    const handleSkipAnamnesis = () => {
        alert('Agendamento recebido! Você poderá preencher a ficha de anamnese depois.');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={step === 1 ? onClose : undefined} // Prevenir fechar clicando fora na etapa 2 acidentalmente
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="bg-sky-50 px-6 py-4 border-b border-sky-100 flex justify-between items-center transition-all">
                    <div>
                        <h3 className="text-xl font-bold text-sky-900">
                            {step === 1 ? 'Agendar Atendimento' : 'Ficha de Triagem'}
                        </h3>
                        <p className="text-sm text-sky-700">
                            {step === 1 ? 'Preencha os dados e escolha o melhor horário' : 'Etapa 2 de 2: Conhecendo o paciente'}
                        </p>
                    </div>
                    {step === 1 && (
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-sky-100/50 text-sky-700 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    )}
                </div>

                {/* Body */}
                <div className="p-6 max-h-[80vh] overflow-y-auto">
                    {step === 1 ? (
                        <SchedulingForm
                            onSuccess={handleSchedulingSuccess}
                            onCancel={onClose}
                        />
                    ) : (
                        <AnamnesisForm
                            patientId={createdPatientId}
                            onSuccess={handleFinalSuccess}
                            onSkip={handleSkipAnamnesis}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
