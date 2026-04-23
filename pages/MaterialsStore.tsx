import React from 'react';
import { ShoppingBag, Star, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { products } from '../data/products';
import { setDynamicSEO } from '../utils/seo';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const MaterialsStore: React.FC = () => {
    React.useEffect(() => {
        window.scrollTo(0, 0);
        setDynamicSEO(
            "Materiais e Recursos | Léia Neves",
            "Recursos desenvolvidos com cuidado especializado para apoiar o desenvolvimento, a alfabetização e a rotina da criança atípica."
        );
    }, []);

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            <Navbar onOpenScheduling={() => {}} />

            {/* Store Header - Minimalist Style */}
            <div className="border-b border-slate-100 py-8 bg-white">
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Materiais</h1>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                        <Link to="/" className="hover:text-sky-600 transition-colors">Home</Link>
                        <span className="text-slate-200">|</span>
                        <span className="text-slate-800">Loja de Recursos</span>
                    </div>
                </div>
            </div>

            {/* Store Hero - Focused on Authority */}
            <section className="bg-slate-50 py-20 border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="inline-block px-4 py-2 bg-sky-100 text-sky-700 text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-6">
                        Recursos Baseados em Evidências
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 leading-tight max-w-3xl mx-auto tracking-tight">
                        Ferramentas Práticas para o <span className="text-sky-600">Desenvolvimento Atípico</span>
                    </h2>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
                        Materiais desenvolvidos em consultório para apoiar a alfabetização, rotina e regulação emocional de crianças com TEA e TDAH.
                    </p>
                </div>
            </section>

            {/* Products Grid */}
            <main className="flex-1 max-w-7xl mx-auto px-6 py-20 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {products.map((product) => (
                        <Link 
                            key={product.id} 
                            to={`/materiais/${product.id}`} 
                            className="group flex flex-col bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500"
                        >
                            {/* Product Image */}
                            <div className="relative aspect-[4/3] bg-slate-50 overflow-hidden flex items-center justify-center p-8">
                                {product.tag && (
                                    <div className="absolute top-4 left-4 bg-slate-900 text-white text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest z-10">
                                        {product.tag}
                                    </div>
                                )}
                                <div className="transform group-hover:scale-110 transition-transform duration-700">
                                    {product.imageUrl ? (
                                        <img 
                                            src={product.imageUrl} 
                                            alt={product.title} 
                                            loading="lazy"
                                            className="w-full h-full object-contain" 
                                        />
                                    ) : (
                                        <div className="text-slate-200 opacity-50">
                                            {product.icon}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="p-8 flex flex-col flex-1">
                                <div className="flex items-center gap-1 text-amber-400 mb-4">
                                    <Star size={12} fill="currentColor" />
                                    <span className="text-slate-400 font-bold text-[10px] tracking-widest uppercase ml-1">{product.rating} Avaliação</span>
                                </div>
                                <h3 className="text-xl font-black text-slate-800 mb-4 leading-tight group-hover:text-sky-600 transition-colors">
                                    {product.title}
                                </h3>
                                <p className="text-slate-500 text-[13px] leading-relaxed mb-8 flex-1 font-medium line-clamp-3">
                                    {product.description}
                                </p>

                                <div className="flex items-end justify-between">
                                    <div className="flex flex-col">
                                        {product.originalPrice && (
                                            <span className="text-[11px] text-slate-300 line-through font-bold mb-1">
                                                R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                                            </span>
                                        )}
                                        <span className="text-2xl font-black text-slate-900 tracking-tight">
                                            R$ {product.price.toFixed(2).replace('.', ',')}
                                        </span>
                                    </div>
                                    <div className="w-10 h-10 bg-slate-50 group-hover:bg-sky-600 text-slate-300 group-hover:text-white rounded-full flex items-center justify-center transition-all duration-300">
                                        <ChevronRight size={20} />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
};
