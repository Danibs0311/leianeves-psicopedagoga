import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ShieldCheck, Star, AlertCircle, ChevronDown, ChevronUp, BookOpen, Quote, HeartHandshake } from 'lucide-react';
import { getProductById } from '../data/products';
import profileImage from '../images/leia_psicoped.webp';

export const ProductSalesPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const product = getProductById(Number(id));
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (product) {
            document.title = `${product.title} | Léia Neves Psicopedagoga`;
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
                metaDescription.setAttribute("content", product.description);
            }
        }
    }, [id, product]);

    const handleCheckout = () => {
        if (product?.checkoutUrl) {
            window.location.href = product.checkoutUrl;
        } else {
            alert("Integração de pagamento pendente.");
        }
    };

    if (!product) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold text-slate-800 mb-4">Produto não encontrado</h1>
                <Link to="/materiais" className="bg-sky-600 text-white px-6 py-3 rounded-full hover:bg-sky-700 transition flex items-center gap-2">
                    <ArrowLeft size={20} /> Voltar para a Loja
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-inter text-slate-900 selection:bg-sky-100 selection:text-sky-900">
            {/* CLEAN HEADER */}
            <header className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 sm:h-20">
                        <Link to="/materiais" className="text-slate-500 hover:text-sky-600 transition-colors flex items-center gap-2 text-sm font-semibold uppercase tracking-wider">
                            <ArrowLeft size={16} /> Voltar
                        </Link>
                        <span className="text-lg font-black text-slate-900 tracking-tighter">
                            Léia<span className="text-sky-600">Neves</span>
                        </span>
                    </div>
                </div>
            </header>

            <main>
                {/* HERO SECTION - Trusted & Academic Elegance */}
                <section className="bg-slate-50 py-16 lg:py-24 border-b border-slate-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                            
                            {/* Text Content */}
                            <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-sm font-semibold tracking-wide mb-6">
                                    <Star size={14} className="fill-amber-500 text-amber-500" />
                                    <span>Material Recomendado por Pais e Educadores</span>
                                </div>

                                <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-6 leading-[1.15] tracking-tight">
                                    {product.title}
                                </h1>
                                
                                <p className="text-lg sm:text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl">
                                    {product.description}
                                </p>

                                {/* Elegance Pricing Card */}
                                <div className="bg-white border border-slate-200 rounded-3xl p-8 w-full max-w-md shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                    <div className="flex items-end gap-3 mb-6 justify-center lg:justify-start">
                                        <span className="text-5xl font-black text-slate-900">
                                            R$ {product.price.toFixed(2).replace('.', ',')}
                                        </span>
                                        {product.originalPrice && (
                                            <span className="text-lg text-slate-400 line-through font-medium mb-1">
                                                R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                                            </span>
                                        )}
                                    </div>
                                    
                                    <button
                                        onClick={handleCheckout}
                                        className="w-full py-4 px-8 bg-sky-600 hover:bg-sky-700 text-white text-xl font-bold rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
                                    >
                                        Adquira Já o Seu
                                    </button>
                                    
                                    <div className="mt-4 flex items-center justify-center gap-2 text-slate-500 text-sm font-medium">
                                        <ShieldCheck size={18} className="text-green-500" />
                                        <span>Compra Criptografada e Segura pela Eduzz</span>
                                    </div>
                                </div>
                            </div>

                            {/* Image Content */}
                            <div className="w-full lg:w-1/2 flex justify-center">
                                <div className="relative w-full max-w-[420px]">
                                    {/* Soft shadow under the book */}
                                    <div className="absolute -bottom-6 lg:-bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-black/20 blur-xl rounded-[100%]"></div>
                                    
                                    <div className="relative z-10 bg-white rounded-3xl p-4 shadow-xl border border-slate-100 hover:-translate-y-2 transition-transform duration-500">
                                        {product.imageUrl ? (
                                            <img src={product.imageUrl} alt={product.title} className="w-full h-auto object-contain rounded-2xl" />
                                        ) : (
                                            <div className="aspect-[4/5] flex flex-col items-center justify-center bg-slate-50 rounded-2xl">
                                                <div className="transform scale-[2] text-slate-300 mb-6">{product.icon}</div>
                                                <span className="text-slate-400 font-bold uppercase tracking-widest text-sm">Capa Ilustrativa</span>
                                            </div>
                                        )}
                                        {product.tag && (
                                            <div className="absolute -top-4 -right-4 bg-amber-400 text-amber-950 font-black px-6 py-2 rounded-full uppercase tracking-widest text-sm shadow-md">
                                                {product.tag}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* EMPATHETIC PROBLEM SECTION ("Isso soa familiar?") */}
                {product.painPoints && product.painPoints.length > 0 && (
                    <section className="py-20 lg:py-28 bg-white overflow-hidden relative border-b border-slate-100">
                        {/* Soft background shape for harmony */}
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50/50 -skew-x-12 origin-top-right -z-10"></div>
                        
                        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center md:text-left mb-16 max-w-3xl">
                                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-6">
                                    O desgaste diário soa familiar para você?
                                </h2>
                                <p className="text-xl text-slate-600 leading-relaxed">
                                    Muitas famílias vivenciam uma rotina exaustiva tentando adequar o ritmo da criança ao que é esperado, gerando desgaste e frustração para ambos os lados.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {product.painPoints.map((point, index) => (
                                    <div key={index} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                        <AlertCircle className="text-rose-400 mb-4 w-8 h-8" strokeWidth={2} />
                                        <p className="text-slate-700 text-lg leading-relaxed">{point}</p>
                                    </div>
                                ))}
                            </div>

                            {/* The Bridge (Connecting problem to solution beautifully) */}
                            <div className="mt-20 bg-sky-50 rounded-3xl p-10 lg:p-16 border border-sky-100 flex flex-col md:flex-row items-center justify-between gap-10">
                                <div className="max-w-xl text-center md:text-left">
                                    <h3 className="text-2xl sm:text-3xl font-bold text-sky-950 mb-4">
                                        Esse cenário não precisa ser para sempre.
                                    </h3>
                                    <p className="text-lg text-sky-800/80 leading-relaxed font-medium">
                                        A dificuldade de aprendizagem não define quem a criança é. Ela apenas mostra que a jornada dela precisa de rotas diferentes.
                                    </p>
                                </div>
                                <div className="shrink-0 w-full md:w-auto">
                                    <button
                                        onClick={handleCheckout}
                                        className="w-full md:w-auto px-8 py-4 bg-sky-600 hover:bg-sky-700 text-white text-lg font-bold rounded-xl transition-all shadow-md active:scale-[0.98]"
                                    >
                                        Quero Iniciar a Mudança
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* THE SOLUTION (Benefits & Deep Explanation) */}
                <section className="py-20 lg:py-28 bg-slate-900 border-b border-slate-800 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                            <div>
                                <h2 className="text-3xl sm:text-4xl font-black mb-8 leading-tight text-white">
                                    O caminho prático para uma <span className="text-sky-400">rotina sem sofrimento</span>.
                                </h2>
                                <div className="text-lg text-slate-300 space-y-6 leading-relaxed">
                                    <p className="font-semibold text-white/90 text-xl border-l-4 border-sky-500 pl-5">
                                        Entendimento gera empatia. Empatia gera ajuste. Ajuste gera desenvolvimento.
                                    </p>
                                    <p className="font-light">
                                        {product.longDescription}
                                    </p>
                                    
                                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 italic mt-8 font-light text-slate-400">
                                        <Quote size={24} className="text-sky-500/50 mb-3" />
                                        "Nenhuma criança aprende melhor quando não é compreendida. Este guia é o mapa para apoiar sem fazer pelo filho, e amar sem adoecer."
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 sm:p-10 shadow-2xl">
                                <h3 className="text-2xl font-bold text-white mb-8">O que você vai descobrir:</h3>
                                <ul className="space-y-6">
                                    {product.benefits?.map((benefit, index) => (
                                        <li key={index} className="flex items-start gap-4">
                                            <CheckCircle2 size={24} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                                            <span className="text-slate-200 text-lg leading-relaxed">{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* AUTHOR SECTION - Clear & Trusted */}
                {product.authorSection && (
                    <section className="py-20 bg-slate-50 border-b border-slate-200">
                        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 sm:p-16 shadow-sm flex flex-col md:flex-row items-center gap-10 md:gap-16">
                                <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full border-4 border-slate-100 overflow-hidden shrink-0 shadow-lg">
                                    <img src={profileImage} alt="Léia Neves" className="w-full h-full object-cover" />
                                </div>
                                <div className="text-center md:text-left">
                                    <div className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
                                        Especialista Responsável
                                    </div>
                                    <h2 className="text-3xl sm:text-4xl font-black mb-2 text-slate-900">Léia Neves</h2>
                                    <h3 className="text-xl text-sky-600 font-semibold mb-6">Psicopedagoga Especialista em TEA e TDAH, Neuropsicopedagoga</h3>
                                    <p className="text-slate-600 text-lg leading-relaxed">
                                        Com prática clínica diária, Léia desenvolve trilhas terapêuticas focadas na autonomia de crianças com desenvolvimento atípico. Sua missão é traduzir conhecimentos da neurociência para uma linguagem acolhedora, ajudando pais a estruturarem lares firmes e amorosos.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* FAQ SECTION - Clean Accordion */}
                {product.faq && product.faq.length > 0 && (
                    <section className="py-20 lg:py-28 bg-white">
                        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Perguntas Frequentes</h2>
                                <p className="text-slate-500 mt-4 text-lg">Esclareça suas dúvidas antes de garantir seu acesso.</p>
                            </div>
                            
                            <div className="space-y-4">
                                {product.faq.map((item, index) => {
                                    const isOpen = openFaq === index;
                                    return (
                                        <div 
                                            key={index} 
                                            className="border-b border-slate-200 last:border-0 pb-4"
                                        >
                                            <button 
                                                className="w-full text-left py-4 flex items-center justify-between gap-6 group outline-none"
                                                onClick={() => setOpenFaq(isOpen ? null : index)}
                                            >
                                                <span className={`text-xl font-bold transition-colors ${isOpen ? 'text-sky-600' : 'text-slate-800 group-hover:text-sky-600'}`}>
                                                    {item.q}
                                                </span>
                                                <div className={`shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-sky-600' : 'text-slate-400 group-hover:text-sky-600'}`}>
                                                    <ChevronDown size={24} />
                                                </div>
                                            </button>
                                            
                                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                                <p className="text-slate-600 text-lg leading-relaxed pb-6 pt-2 pr-12">{item.a}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </section>
                )}

                {/* FINAL SIMPLE CTA */}
                <section className="py-20 bg-sky-600 text-center">
                    <div className="max-w-4xl mx-auto px-4">
                        <HeartHandshake size={48} className="text-sky-200 mx-auto mb-8" />
                        <h2 className="text-3xl sm:text-5xl font-black text-white mb-6">
                            Pronto para essa transformação?
                        </h2>
                        <p className="text-xl text-sky-100 font-medium mb-10 max-w-2xl mx-auto">
                            O material completo chegará diretamente no seu e-mail de forma imediata.
                        </p>
                        <button
                            onClick={handleCheckout}
                            className="inline-flex items-center justify-center px-10 py-5 bg-white hover:bg-slate-50 text-sky-700 text-xl sm:text-2xl font-bold rounded-full transition-all shadow-lg active:scale-[0.98]"
                        >
                            Adquira Já o Seu
                        </button>
                    </div>
                </section>
            </main>

            {/* MINIMAL FOOTER */}
            <footer className="bg-slate-900 text-slate-500 py-12 text-center border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4">
                    <span className="text-xl font-black text-white opacity-20 tracking-tight block mb-6">
                        LéiaNeves
                    </span>
                    <p className="text-sm mb-2 font-medium">Este site não faz parte dos produtos da plataforma Meta (Facebook, Instagram) nem do Google Inc.</p>
                    <p className="text-sm mb-6 font-medium">Os resultados podem variar de acordo com a aplicação de cada família.</p>
                    <p className="text-xs tracking-wider">© {new Date().getFullYear()} Léia Neves. Todos os direitos reservados.</p>
                </div>
            </footer>
        </div>
    );
};
