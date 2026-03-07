
import React from 'react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: "01",
      title: "Avaliação Detalhada",
      description: "Mapeamos as habilidades cognitivas, emocionais e de aprendizagem para entender a raiz do desafio."
    },
    {
      number: "02",
      title: "Plano de Intervenção",
      description: "Criamos um roteiro personalizado com estratégias específicas para as necessidades do seu filho."
    },
    {
      number: "03",
      title: "Acompanhamento Ativo",
      description: "Sessões dinâmicas onde a criança desenvolve autonomia, foco e habilidades de leitura e escrita."
    },
    {
      number: "04",
      title: "Suporte à Família",
      description: "Orientação contínua para os pais saberem exatamente como agir em casa e na escola."
    }
  ];

  return (
    <section id="metodo" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Como funciona o atendimento?</h2>
          <p className="text-lg text-slate-600">Um processo estruturado para gerar evolução real e duradoura.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {steps.map((step, idx) => (
            <div key={idx} className="relative group">
              {idx !== steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-[2px] bg-slate-100 -z-10 -translate-x-8"></div>
              )}
              <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-sky-600 transition-colors duration-300">
                <span className="text-2xl font-bold text-sky-600 group-hover:text-white">{step.number}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
              <p className="text-slate-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
