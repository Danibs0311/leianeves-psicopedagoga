
import React from 'react';

export const Benefits: React.FC = () => {
  const benefits = [
    {
      title: "Autonomia Escolar",
      description: "Seu filho mais confiante para realizar tarefas e participar das aulas.",
      icon: "🎯"
    },
    {
      title: "Paz em Casa",
      description: "Redução de conflitos na hora do estudo e maior harmonia familiar.",
      icon: "🏠"
    },
    {
      title: "Alfabetização Real",
      description: "Vencendo as barreiras da leitura e escrita com métodos eficazes.",
      icon: "✏️"
    },
    {
      title: "Fim da Ansiedade",
      description: "Você entende o que seu filho precisa e como pode ajudá-lo de verdade.",
      icon: "✨"
    },
    {
      title: "Foco e Organização",
      description: "Estratégias para lidar com a impulsividade e a falta de atenção do TDAH.",
      icon: "🧩"
    },
    {
      title: "Parceria com a Escola",
      description: "Orientação técnica para adaptações curriculares quando necessário.",
      icon: "🤝"
    }
  ];

  return (
    <section id="beneficios" className="py-20 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Os benefícios que sua família merece</h2>
          <p className="text-lg text-slate-400">Muito além de notas escolares: desenvolvimento para a vida.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
              <div className="text-3xl mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
              <p className="text-slate-400 leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
