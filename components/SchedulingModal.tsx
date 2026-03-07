
import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { SchedulingForm } from './SchedulingForm';

interface SchedulingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SchedulingModal: React.FC<SchedulingModalProps> = ({ isOpen, onClose }) => {
    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="bg-sky-50 px-6 py-4 border-b border-sky-100 flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold text-sky-900">Agendar Atendimento</h3>
                        <p className="text-sm text-sky-700">Preencha os dados e escolha o melhor horário</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-sky-100/50 text-sky-700 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 max-h-[80vh] overflow-y-auto">
                    <SchedulingForm
                        onSuccess={() => {
                            // TODO: Mostrar mensagem de sucesso antes de fechar ou fechar e mostrar toast
                            alert('Agendamento recebido com sucesso! Entraremos em contato para confirmar.');
                            onClose();
                        }}
                        onCancel={onClose}
                    />
                </div>
            </div>
        </div>
    );
};
