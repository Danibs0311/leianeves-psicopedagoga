
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
              Quem é Léia Neves?
            </h2>
            <div className="space-y-4 text-lg text-slate-700 leading-relaxed">
              <p>
                Olá! Sou <strong>Léia Neves</strong>, Psicopedagoga e Neuropsicopedagoga com anos de experiência dedicada ao desenvolvimento infantil.
              </p>
              <p>
                Minha missão é ser a ponte entre o potencial da criança e suas conquistas reais. Especializei-me em <strong>TEA (Autismo) e TDAH</strong> porque acredito que cada cérebro aprende de uma forma única, e ignorar essa singularidade é o que gera frustração escolar.
              </p>
              <p>
                Com foco em <strong>alfabetização e letramento baseados em evidências</strong>, utilizo métodos que a ciência já comprovou serem eficazes, poupando tempo precioso da criança e reduzindo a ansiedade da família.
              </p>
              <ul className="space-y-3 mt-6">
                {[
                  "Especialista em Neuropsicopedagogia Clínica",
                  "Expert em Intervenção no Autismo e TDAH",
                  "Foco em Alfabetização Baseada na Ciência da Leitura",
                  "Orientação Parental e Consultoria Educacional"
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
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="https://biolink.info/leianeves_psicopedagoga"
                className="bg-sky-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-sky-700 transition-all shadow-lg active:scale-95"
              >
                Falar com a Léia
              </a>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
