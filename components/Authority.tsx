
import React from 'react';
import { InstagramFeed } from './InstagramFeed';

export const Authority: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-sky-50 rounded-3xl p-8 md:p-16 border border-sky-100 relative overflow-hidden">
          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6 italic">
                "Não é sobre rótulos, é sobre caminhos. Cada criança tem um tempo e um jeito de florescer."
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-sky-200 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-sky-700" fill="currentColor" viewBox="0 0 20 20"><path d="M9 4.804A7.993 7.993 0 002 12a8 8 0 008 8 8 8 0 008-8 7.993 7.993 0 00-7-7.196V4a1 1 0 00-2 0v.804zM10 18a6 6 0 110-12 6 6 0 010 12z"/></svg>
                  </div>
                  <p className="text-slate-700 font-medium">
                    Atendimento baseado na Análise do Comportamento Aplicada (ABA) e Neuropsicopedagogia.
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-sky-200 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-sky-700" fill="currentColor" viewBox="0 0 20 20"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12V11.5a1 1 0 102 0V11l1.618.693a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/></svg>
                  </div>
                  <p className="text-slate-700 font-medium">
                    Estratégias práticas validadas por anos de experiência.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* Decorative glow behind the stat */}
                <div className="absolute inset-0 bg-sky-400/20 blur-2xl rounded-full"></div>
                <div className="relative bg-white p-10 rounded-[2.5rem] shadow-2xl border border-sky-100 flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300">
                  <div className="mb-4 text-sky-500">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-6xl font-black text-sky-700 mb-2 leading-none">98%</p>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-[0.2em]">
                    Satisfação das Famílias
                  </p>
                  <div className="mt-6 flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Decorative icons */}
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <svg className="w-32 h-32 text-sky-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
          </div>

          {/* Instagram Feed Integration */}
          <InstagramFeed />
        </div>
      </div>
    </section>
  );
};
