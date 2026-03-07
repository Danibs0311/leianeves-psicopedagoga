
import React from 'react';

export const PainPoints: React.FC = () => {
  const pains = [
    {
      title: "Medo e Insegurança",
      description: "A sensação de que seu filho está ficando para trás na escola e você não sabe como ajudar.",
      icon: "😟"
    },
    {
      title: "Diagnóstico Sem Direção",
      description: "Você recebeu o laudo de TEA ou TDAH, mas sente-se perdido sobre os próximos passos práticos.",
      icon: "🧭"
    },
    {
      title: "Barreiras na Alfabetização",
      description: "Dificuldades reais em aprender a ler e escrever, gerando frustração tanto na criança quanto na família.",
      icon: "📚"
    },
    {
      title: "Sobrecarga Emocional",
      description: "Culpa e cansaço por não conseguir lidar com as crises ou com as demandas escolares diárias.",
      icon: "⚖️"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Você se sente assim em relação ao seu filho?
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Criar e educar uma criança com necessidades específicas exige mais do que apenas amor; exige estratégia e orientação especializada.
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
            "Não precisa ser uma jornada solitária. Existe um caminho claro e acolhedor para o desenvolvimento do seu filho."
          </p>
        </div>
      </div>
    </section>
  );
};
