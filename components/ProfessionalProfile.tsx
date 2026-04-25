
import React from 'react';
import profileImage from '../images/leia_psicoped.webp';

export const ProfessionalProfile: React.FC = () => {
  return (
    <section id="sobre" className="py-20 bg-slate-50 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl relative z-10">
              <img
                src={profileImage}
                alt="Léia Neves"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-sky-600/10 rounded-full blur-3xl -z-0"></div>
            <div className="absolute -top-10 -left-10 w-48 h-48 bg-blue-600/5 rounded-full blur-2xl -z-0"></div>
          </div>

          <div className="order-1 lg:order-2">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
              Quem vai ajudar seu filho a superar essas dificuldades
            </h2>
            <div className="space-y-4 text-lg text-slate-700 leading-relaxed">
              <p>
                Eu ajudo crianças que enfrentam dificuldades na aprendizagem a desenvolverem <strong>confiança, autonomia e evolução real</strong> na escola — sem pressão e respeitando seu ritmo.
              </p>
              <p>
                Ao longo da minha experiência, percebi que muitas crianças não têm dificuldade de aprender — elas só não estão sendo ensinadas da forma certa.
              </p>
              <p>
                Atuo com foco em crianças com <strong>TDAH, TEA e dificuldades na alfabetização</strong>, utilizando estratégias baseadas em evidências científicas.
              </p>
              <ul className="space-y-3 mt-6">
                {[
                  "Intervenção personalizada para dificuldades reais de aprendizagem",
                  "Acompanhamento individual com foco no progresso da criança",
                  "Estratégias práticas que podem ser aplicadas em casa e na escola",
                  "Orientação clara para pais que não sabem por onde começar"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-sky-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-10">
              <p className="text-lg font-medium text-slate-800 mb-5">
                Se você chegou até aqui, provavelmente já percebeu que seu filho precisa de um olhar mais atento.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://biolink.info/leianeves_psicopedagoga"
                  className="bg-sky-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-sky-700 transition-all shadow-lg active:scale-95"
                >
                  Quero ajuda para meu filho
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
