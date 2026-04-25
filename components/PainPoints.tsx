
import React from 'react';

export const PainPoints: React.FC = () => {
  const pains = [
    {
      title: "Medo e Insegurança",
      description: "Seu filho está ficando para trás — e você não sabe como ajudar.",
      icon: "😟"
    },
    {
      title: "Diagnóstico sem direção",
      description: "Você recebeu um diagnóstico, mas ninguém explicou o que fazer agora.",
      icon: "🧭"
    },
    {
      title: "Barreiras na alfabetização",
      description: "Seu filho tenta aprender, mas enfrenta dificuldades que ninguém parece entender.",
      icon: "📚"
    },
    {
      title: "Sobrecarga emocional",
      description: "Você se sente cansado, culpado e sobrecarregado com tudo isso.",
      icon: "⚖️"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Se você vive isso com seu filho, não ignore esses sinais
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Criar e educar uma criança com dificuldades de aprendizagem pode gerar dúvidas, culpa e exaustão — especialmente quando você não sabe por onde começar.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pains.map((pain, idx) => (
            <div key={idx} className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-sky-200 hover:bg-sky-50 transition-all group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform inline-block">
                {pain.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{pain.title}</h3>
              <p className="text-slate-600 leading-relaxed">
                {pain.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-xl font-medium text-sky-700 italic">
            "Você não precisa passar por isso sozinho — existe um caminho claro para entender e ajudar seu filho com segurança."
          </p>
        </div>
      </div>
    </section>
  );
};
