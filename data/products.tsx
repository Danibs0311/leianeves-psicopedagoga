import React from 'react';
import { BookOpen, Puzzle, FileText } from 'lucide-react';

export interface Product {
    id: number;
    title: string;
    description: string;
    longDescription?: string;
    price: number;
    originalPrice: number | null;
    rating: number;
    icon: React.ReactNode;
    tag?: string;
    benefits?: string[];
    imageUrl?: string;
    checkoutUrl?: string;
    painPoints?: string[];
    faq?: { q: string; a: string }[];
    authorSection?: boolean;
}

export const products: Product[] = [
    {
        id: 1,
        title: "Guia Completo: Rotina Visual para TEA",
        description: "Kit contendo 50 cards ilustrados imprimíveis, planner semanal e manual de instruções para estruturar a rotina de crianças no espectro autista.",
        longDescription: "A previsibilidade é fundamental para crianças no espectro autista. Este Guia Completo de Rotina Visual foi cuidadosamente elaborado com base em práticas baseadas em evidências para reduzir a ansiedade e promover a autonomia do seu filho no dia a dia. Chega de lutas diárias nas transições de atividades!",
        price: 67.90,
        originalPrice: 97.00,
        rating: 5.0,
        icon: <Puzzle className="w-12 h-12 text-sky-600 mb-4" />,
        tag: "Mais Vendido",
        benefits: [
            "Reduz significativamente crises de ansiedade na criança.",
            "Aumenta a autonomia em atividades de vida diária (AVDs).",
            "Facilita transições difíceis, como hora de dormir e de ir para a escola.",
            "Inclui 50 cards ilustrados em alta resolução prontos para imprimir.",
            "Bônus: Manual de instruções em vídeo."
        ]
    },
    {
        id: 2,
        title: "Cartilha: Adaptação Escolar Sem Choro",
        description: "E-book prático com 30 páginas de estratégias cientificamente comprovadas para uma transição escolar suave e acolhedora.",
        longDescription: "A adaptação escolar pode ser o período mais estressante tanto para a criança atípica quanto para a família. Esta cartilha traz as mesmas estratégias que utilizo nas orientações de pais em meu consultório para transformar o choro e a insegurança escolar em entusiasmo e cooperação.",
        price: 34.50,
        originalPrice: null,
        rating: 4.8,
        icon: <BookOpen className="w-12 h-12 text-sky-600 mb-4" />,
        benefits: [
            "Técnicas de dessensibilização para o ambiente escolar.",
            "Roteiros de conversa para comunicar professores e cuidadores.",
            "Checklists de previsibilidade pré-aula.",
            "Dicas de intervenção precoce em caso de crises na porta da escola.",
            "Formato e-book (PDF) para leitura rápida no celular."
        ]
    },
    {
        id: 3,
        title: "Caderno de Atividades: Foco e Atenção (TDAH)",
        description: "100 atividades lúdicas em PDF prontas para impressão, focadas no desenvolvimento da coordenação motora fina e atenção sustentada.",
        longDescription: "Estimular o foco em crianças com TDAH exige que o formato seja atrativo e com nível de desafio ideal. Este caderno possui 100 páginas de labirintos, rastreios visuais, pareamento e exercícios de coordenação motora fina desenvolvidos para treinar o cérebro brincando.",
        price: 49.90,
        originalPrice: 79.90,
        rating: 4.9,
        icon: <FileText className="w-12 h-12 text-sky-600 mb-4" />,
        tag: "Lançamento",
        benefits: [
            "Aumenta o tempo de atenção sustentada da criança.",
            "Desenvolve a coordenação motora fina (preparação para a escrita).",
            "Melhora o rastreio visual e processamento cognitivo.",
            "Folhas projetadas para evitar sobrecarga sensorial e visual.",
            "Totalmente imprimível para usar quantas vezes precisar."
        ]
    },
    {
        id: 4,
        title: "Quando Aprender Não é Simples",
        description: "O guia prático para famílias entenderem o comportamento e apoiarem os filhos neurodivergentes de forma eficaz e sem sofrimento.",
        longDescription: "Seu filho se frustra facilmente? A hora da tarefa escolar vira um campo de batalha? A previsibilidade e a adaptação do ambiente são vitais para reduzir crises infantis. Este e-book é um manual prático e acolhedor (escrito por uma profissional que atua diariamente com famílias atípicas) focado em ensinar adultos a olharem o comportamento como comunicação, criar rotinas que abraçam e construir autonomia emocional real.",
        price: 24.90,
        originalPrice: null,
        rating: 5.0,
        icon: <BookOpen className="w-12 h-12 text-sky-600 mb-4" />,
        tag: "Magnético",
        imageUrl: "/capa ebook.png",
        checkoutUrl: "https://chk.eduzz.com/39VK4JRKWR",
        authorSection: true,
        painPoints: [
            "Seu filho tem dificuldade para se concentrar ou acompanhar a escola?",
            "Ele se frustra com facilidade e a hora da tarefa vira um campo de batalha?",
            "As queixas da escola são frequentes, mas as soluções parecem não funcionar?",
            "As famosas ''birras'' escondem crises de sobrecarga sensorial que você não sabe como intervir?",
            "Você se sente esgotado(a) e culpado(a) tentando entender como ajudar sem causar mais crises?"
        ],
        benefits: [
            "Transforme birras e explosões em momentos de compreensão sabendo agir corretamente.",
            "Crie uma rotina que acolhe, estrutura a mente e organiza sem ser uma prisão.",
            "Aprenda as mesmas estratégias do consultório para fazer a tarefa de casa sem choro.",
            "Construa uma parceria prática e exigente com a escola sabendo os seus direitos.",
            "Eleve a autoestima da criança para que ela acredite no seu potencial real."
        ],
        faq: [
            {
                q: "Para qual idade este material é recomendado?",
                a: "As orientações valem desde a primeira infância até a pré-adolescência, pois são focadas nas bases do neurodesenvolvimento infantil e na regulação emocional."
            },
            {
                q: "Este guia é apenas para autistas ou portadores de TDAH?",
                a: "Não! Ele é para qualquer criança que sinta e processe o mundo de forma mais intensa ou demande um modelo adaptado de aprendizagem."
            },
            {
                q: "Vou receber um livro físico?",
                a: "Não, o material é 100% digital (e-book em PDF). Assim que confirmar a compra, ele vai direto para o seu e-mail e você acessa na mesma hora pelo celular ou computador."
            }
        ]
    }
];

export const getProductById = (id: number): Product | undefined => {
    return products.find(product => product.id === id);
};
