
import React from 'react';

interface FinalCTAProps {
  onOpenScheduling: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onOpenScheduling }) => {
  return (
    <section className="py-24 bg-soft-gradient relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-8 leading-tight">
          O potencial do seu filho é único, e o momento de agir por ele é agora.
        </h2>
        <p className="text-xl text-slate-700 mb-12 leading-relaxed">
          Janelas de desenvolvimento se abrem e fecham em ritmos próprios; cada dia de espera é uma chance de aprendizado que não volta. Uma intervenção psicopedagógica profunda e sensível pode ser a chave que faltava para desbloquear o futuro dele. Não deixe para amanhã a evolução que ele pode começar a viver hoje. Agende nossa conversa inicial e vamos dar esse passo decisivo juntos.
        </p>
        <div className="flex flex-col items-center gap-6">
          <button
            onClick={onOpenScheduling}
            className="bg-sky-600 text-white px-12 py-5 rounded-2xl font-bold text-xl hover:bg-sky-700 transition-all shadow-2xl hover:shadow-sky-300 flex items-center gap-3 active:scale-95"
          >
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Agendar Atendimento Agora
          </button>

        </div>
      </div>

      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-sky-200/30 rounded-full blur-3xl -z-0"></div>
    </section>
  );
};
