import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ShieldCheck, Star, AlertCircle, ChevronDown, ChevronUp, BookOpen, ArrowRight, Quote } from 'lucide-react';
import { getProductById } from '../data/products';

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
        <div className="min-h-screen bg-slate-50 font-inter selection:bg-sky-200 selection:text-sky-900">
            {/* Minimal Sticky Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 sm:h-20">
                        <Link to="/materiais" className="text-slate-500 hover:text-sky-600 transition-colors flex items-center gap-2 text-sm font-semibold uppercase tracking-wider">
                            <ArrowLeft size={16} /> Voltar
                        </Link>
                        <span className="text-lg font-black text-sky-800 tracking-tighter">
                            Léia<span className="text-sky-500">Neves</span>
                        </span>
                    </div>
                </div>
            </header>

            <main>
                {/* HERO SECTION - Premium Dark/Gradient */}
                <section className="relative bg-slate-900 overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32">
                    {/* Dynamic background accents */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                        <div className="absolute -top-40 -right-40 w-96 h-96 bg-sky-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                        <div className="absolute top-40 -left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                            
                            {/* Text Content */}
                            <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-6">
                                    <Star size={14} className="text-amber-400 fill-amber-400" />
                                    <span className="text-sky-100 text-sm font-semibold tracking-wide">
                                        Avaliação {product.rating.toFixed(1)}/5 pelos Pais
                                    </span>
                                </div>

                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-[1.1] tracking-tight">
                                    {product.title}
                                </h1>
                                
                                <p className="text-lg sm:text-xl text-sky-100/90 mb-10 leading-relaxed font-light max-w-2xl">
                                    {product.description}
                                </p>

                                {/* Buy Card Floating */}
                                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl relative">
                                    <div className="flex items-baseline gap-3 mb-6">
                                        <span className="text-5xl font-black text-white">
                                            R$ {product.price.toFixed(2).replace('.', ',')}
                                        </span>
                                        {product.originalPrice && (
                                            <span className="text-xl text-sky-200/50 line-through font-medium">
                                                R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                                            </span>
                                        )}
                                    </div>
                                    
                                    <button
                                        onClick={handleCheckout}
                                        className="group relative w-full flex items-center justify-center gap-2 py-4 px-8 bg-sky-500 hover:bg-sky-400 text-white text-xl font-extrabold rounded-2xl transition-all shadow-[0_0_40px_rgba(14,165,233,0.4)] hover:shadow-[0_0_60px_rgba(14,165,233,0.6)] hover:-translate-y-1 overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                                        Adquira Já o Seu
                                        <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                    
                                    <div className="mt-5 flex items-center justify-center gap-2 text-sky-200 text-sm font-medium">
                                        <ShieldCheck size={18} className="text-green-400" />
                                        <span>Pagamento Seguro Geração de Acesso Imediato</span>
                                    </div>
                                </div>
                            </div>

                            {/* Image Content */}
                            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end relative">
                                <div className="relative w-full max-w-[400px] group">
                                    <div className="absolute inset-0 bg-sky-500 rounded-3xl transform rotate-3 scale-105 opacity-20 group-hover:rotate-6 transition-transform duration-500"></div>
                                    <div className="absolute inset-0 bg-indigo-500 rounded-3xl transform -rotate-3 scale-105 opacity-20 group-hover:-rotate-6 transition-transform duration-500"></div>
                                    
                                    <div className="relative z-10 bg-gradient-to-tr from-slate-100 to-white rounded-3xl p-4 shadow-2xl overflow-hidden group-hover:-translate-y-2 transition-transform duration-500 border border-slate-200/50">
                                        {product.imageUrl ? (
                                            <img src={product.imageUrl} alt={product.title} className="w-full h-auto object-contain rounded-2xl" />
                                        ) : (
                                            <div className="aspect-[4/5] flex flex-col items-center justify-center bg-sky-50 rounded-2xl">
                                                <div className="transform scale-[2] text-sky-600 opacity-80 mb-6">{product.icon}</div>
                                                <span className="text-slate-400 font-bold uppercase tracking-widest text-sm">Capa Ilustrativa</span>
                                            </div>
                                        )}
                                        {product.tag && (
                                            <div className="absolute top-8 left-0 bg-amber-400 text-amber-900 font-black px-6 py-2 uppercase tracking-widest text-sm shadow-lg transform -translate-x-2">
                                                {product.tag}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* PAIN POINTS - Magnetic Connection */}
                {product.painPoints && product.painPoints.length > 0 && (
                    <section className="py-24 bg-white relative">
                        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                                    Isso soa <span className="text-red-500 relative inline-block">
                                        familiar
                                        <svg className="absolute w-full h-3 -bottom-1 left-0 text-red-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none"/></svg>
                                    </span> para você?
                                </h2>
                                <p className="text-xl text-slate-500 font-medium">O desgaste diário que suga a sua energia e a do seu filho.</p>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-6">
                                {product.painPoints.map((point, index) => (
                                    <div key={index} className="flex gap-4 p-6 sm:p-8 rounded-3xl bg-slate-50 border hover:border-red-200 hover:bg-red-50/50 transition-colors group">
                                        <div className="mt-1 bg-white shadow-sm text-red-500 rounded-full p-2 h-10 w-10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-red-500 group-hover:text-white transition-all">
                                            <AlertCircle size={20} strokeWidth={2.5} />
                                        </div>
                                        <p className="text-slate-700 text-lg leading-relaxed font-medium">{point}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-16 text-center max-w-3xl mx-auto bg-amber-50 rounded-3xl p-8 sm:p-12 border border-amber-100 shadow-sm relative overflow-hidden">
                                <div className="absolute -right-10 -top-10 text-amber-500/10">
                                    <BookOpen size={160} />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4 relative z-10">Esse cenário não precisa ser para sempre.</h3>
                                <p className="text-lg text-slate-600 mb-8 font-medium leading-relaxed relative z-10">
                                    A dificuldade de aprendizagem ou as crises emocionais não definem quem a criança é. Elas indicam que o aprendizado e a segurança dela acontecem por caminhos diferentes.
                                </p>
                                <button
                                    onClick={handleCheckout}
                                    className="relative z-10 inline-flex items-center justify-center gap-2 px-10 py-4 bg-sky-600 hover:bg-sky-500 text-white text-xl font-extrabold rounded-full transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
                                >
                                    Adquira Já o Seu Resolva Isso
                                </button>
                            </div>
                        </div>
                    </section>
                )}

                {/* THE SOLUTION (Long Description & Benefits) */}
                <section className="py-24 bg-sky-50/50 border-y border-sky-100 relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col lg:flex-row gap-16 items-center">
                            <div className="w-full lg:w-1/2">
                                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-6 leading-tight">
                                    O caminho prático para uma rotina <span className="text-sky-600">sem sofrimento</span>.
                                </h2>
                                <div className="text-lg text-slate-600 space-y-6 leading-relaxed">
                                    <p className="font-semibold text-slate-800 text-xl border-l-4 border-sky-500 pl-4">
                                        Entendimento gera empatia. Empatia gera ajuste. Ajuste gera desenvolvimento.
                                    </p>
                                    <p>
                                        {product.longDescription}
                                    </p>
                                    {/* Quote Block */}
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 italic">
                                        <Quote size={24} className="text-sky-300 mb-2" />
                                        "Nenhuma criança aprende melhor quando não é compreendida. Este guia é o mapa para apoiar sem fazer pelo filho, e amar sem adoecer."
                                    </div>
                                </div>
                            </div>

                            <div className="w-full lg:w-1/2">
                                <div className="bg-white rounded-[2rem] p-8 sm:p-10 shadow-xl border border-slate-100">
                                    <h3 className="text-2xl font-bold text-slate-900 mb-8 border-b border-slate-100 pb-4">O que você vai descobrir:</h3>
                                    <ul className="space-y-6">
                                        {product.benefits?.map((benefit, index) => (
                                            <li key={index} className="flex items-start gap-4">
                                                <div className="mt-1 bg-emerald-100 text-emerald-600 rounded-full p-1.5 flex-shrink-0 shadow-sm">
                                                    <CheckCircle2 size={20} className="fill-emerald-100" strokeWidth={2.5} />
                                                </div>
                                                <span className="text-slate-700 text-lg leading-relaxed font-medium">{benefit}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* AUTHOR SECTION - Authority */}
                {product.authorSection && (
                    <section className="py-24 bg-slate-900 border-t border-slate-800 relative overflow-hidden">
                        {/* Decorative background element */}
                        <div className="absolute right-0 bottom-0 text-sky-500/5 transform translate-x-1/4 translate-y-1/4">
                            <Star size={600} />
                        </div>

                        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                            <div className="flex flex-col md:flex-row items-center gap-12 sm:gap-16 bg-white/5 backdrop-blur-lg border border-white/10 p-8 sm:p-12 rounded-[3rem]">
                                <div className="w-48 h-48 rounded-full border-4 border-sky-500 overflow-hidden flex-shrink-0 bg-sky-900 shadow-[0_0_30px_rgba(14,165,233,0.3)]">
                                    {/* Placeholder for Author Photo - can be replaced via props/data later */}
                                    <div className="w-full h-full flex flex-col justify-center items-center text-sky-200">
                                        <span className="text-5xl font-black">LN</span>
                                        <span className="text-[10px] tracking-widest mt-1 uppercase opacity-50">Léia Neves</span>
                                    </div>
                                </div>
                                <div className="text-center md:text-left text-white">
                                    <div className="inline-block px-3 py-1 bg-sky-500/20 text-sky-300 rounded-full text-sm font-bold tracking-wider mb-4 border border-sky-500/30">
                                        AUTORA
                                    </div>
                                    <h2 className="text-3xl sm:text-4xl font-black mb-3 text-white">Léia Neves</h2>
                                    <h3 className="text-xl text-sky-400 font-semibold mb-6">Psicopedagoga Especialista em TEA e TDAH, Neuropsicopedagoga</h3>
                                    <p className="text-slate-300 text-lg leading-relaxed font-light">
                                        Com prática diária e escuta clínica aguçada, Léia desenvolve trilhas de desenvolvimento para crianças que aprendem e sentem o mundo de outra forma. 
                                        Sua missão é clara: traduzir a neurociência e a pedagogia em estratégias simples, amorosas e firmes para que as famílias construam autonomia real em seus lares.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* FAQ SECTION */}
                {product.faq && product.faq.length > 0 && (
                    <section className="py-24 bg-white">
                        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Dúvidas Frequentes</h2>
                            </div>
                            
                            <div className="space-y-4">
                                {product.faq.map((item, index) => {
                                    const isOpen = openFaq === index;
                                    return (
                                        <div 
                                            key={index} 
                                            className={`rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen ? 'border-sky-300 bg-sky-50/30 shadow-md' : 'border-slate-200 bg-white hover:border-sky-200'}`}
                                        >
                                            <button 
                                                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
                                                onClick={() => setOpenFaq(isOpen ? null : index)}
                                            >
                                                <span className="text-lg font-bold text-slate-800">{item.q}</span>
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${isOpen ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                </div>
                                            </button>
                                            
                                            <div className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                                                <div className="w-12 h-1 bg-sky-200 mb-4 rounded-full"></div>
                                                <p className="text-slate-600 text-lg leading-relaxed">{item.a}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </section>
                )}

                {/* FINAL CTA FIXO */}
                <section className="py-20 bg-gradient-to-t from-sky-900 to-slate-900 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
                    <div className="max-w-3xl mx-auto px-4 relative z-10">
                        <h2 className="text-3xl sm:text-5xl font-black text-white mb-8">
                            Pronto para mudar a dinâmica da sua casa?
                        </h2>
                        <button
                            onClick={handleCheckout}
                            className="group relative inline-flex items-center justify-center gap-2 px-10 py-5 bg-sky-500 hover:bg-sky-400 text-white text-2xl font-extrabold rounded-full transition-all shadow-[0_0_40px_rgba(14,165,233,0.5)] hover:shadow-[0_0_60px_rgba(14,165,233,0.7)] hover:-translate-y-1 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                            Adquira Já o Seu
                            <ArrowRight size={28} className="group-hover:translate-x-2 transition-transform" />
                        </button>
                    </div>
                </section>
            </main>

            <footer className="bg-slate-950 text-slate-500 py-12 text-center">
                <div className="max-w-7xl mx-auto px-4">
                    <span className="text-2xl font-black text-slate-700 tracking-tight block mb-6">
                        Léia<span className="text-sky-900">Neves</span>
                    </span>
                    <p className="text-sm mb-2 font-medium">Este site não faz parte dos produtos da plataforma Meta (Facebook, Instagram) nem do Google Inc.</p>
                    <p className="text-sm mb-6 font-medium">Os resultados apresentados dependem do engajamento e aplicação prática de cada família.</p>
                    <p className="text-xs tracking-wider">© {new Date().getFullYear()} Léia Neves. Todos os direitos reservados.</p>
                </div>
            </footer>
        </div>
    );
};
