
import React from 'react';
import heroImage from '../images/rf7qvvtb.png';

interface HeroProps {
  onOpenScheduling: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenScheduling }) => {
  return (
    <section className="relative overflow-hidden bg-soft-gradient py-12 lg:py-24">
      {/* Background shapes */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-sky-200/40 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-blue-100/50 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-wider text-sky-700 uppercase bg-sky-100 rounded-full">
              Psicopedagoga & Neuropsicopedagoga
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.15] mb-8 max-w-2xl mx-auto lg:mx-0">
              Seu filho tem dificuldade para <span className="text-sky-600">aprender</span> — e você sente que ninguém explica o motivo?
            </h1>
            <p className="text-lg sm:text-xl text-slate-700 font-medium mb-6 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Dificuldade na leitura, falta de atenção, desinteresse pela escola…<br />
              <span className="mt-2 block">Esses sinais podem indicar algo que precisa ser compreendido com cuidado e estratégia.</span>
            </p>
            <p className="text-sm sm:text-base text-slate-500 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Atendimento psicopedagógico especializado em TDAH, TEA e dificuldades de aprendizagem, com acompanhamento individual e baseado em evidências.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={onOpenScheduling}
                className="bg-sky-600 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-black text-lg hover:bg-sky-700 transition-all duration-300 shadow-xl shadow-sky-600/20 hover:shadow-2xl hover:shadow-sky-600/40 hover:-translate-y-1 flex items-center justify-center gap-3 group"
              >
                Quero entender o que está acontecendo
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <a
                href="#metodo"
                className="bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center"
              >
                Como funciona o atendimento
              </a>
            </div>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6">
              <div className="flex -space-x-2 flex-shrink-0">
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm"
                    src={`https://picsum.photos/100/100?random=${i}`}
                    alt="Família atendida"
                  />
                ))}
              </div>
              <p className="text-sm text-slate-500 text-center sm:text-left leading-relaxed max-w-sm lg:max-w-md">
                <span className="font-bold text-slate-900">Mais de 100 famílias</span> já entenderam e superaram dificuldades de aprendizagem com acompanhamento especializado.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
              <img
                src={heroImage}
                alt="Psicopedagogia em ação"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating Info Box */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-lg border border-slate-100 hidden sm:block max-w-[320px]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 flex-shrink-0 bg-sky-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-sky-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">Cuidado com base científica</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">Intervenções seguras, personalizadas e com foco real no desenvolvimento da criança</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
