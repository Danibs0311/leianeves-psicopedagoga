import React from 'react';
import { ArrowLeft, ShoppingBag, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { products } from '../data/products';

export const MaterialsStore: React.FC = () => {

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Store Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-sky-600 transition-colors font-medium">
                            <ArrowLeft size={20} />
                            Voltar ao Início
                        </Link>
                        <div className="flex-shrink-0 flex items-center">
                            <span className="text-xl font-bold text-sky-700 tracking-tight">
                                Léia<span className="text-sky-500">Neves</span> <span className="text-slate-300 font-light mx-2">|</span> <span className="text-slate-800">Materiais</span>
                            </span>
                        </div>
                        <button className="text-slate-400 hover:text-sky-600 transition-colors relative">
                            <ShoppingBag size={24} />
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">0</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Store Hero */}
            <section className="bg-sky-50 py-16 sm:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                        Recursos Baseados em <span className="text-sky-600">Ciência</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
                        Materiais desenvolvidos com cuidado especializado para apoiar o desenvolvimento, a alfabetização e a rotina do seu filho.
                    </p>
                </div>
            </section>

            {/* Products Grid */}
            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product) => (
                        <div key={product.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col">
                            {/* Card Image Cover (Simulated with colorful gradient and icon) */}
                            <div className="h-48 bg-gradient-to-br from-sky-50 to-indigo-50 relative flex items-center justify-center">
                                {product.tag && (
                                    <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                        {product.tag}
                                    </div>
                                )}
                                <div className="group-hover:scale-110 transition-transform duration-500">
                                    {product.icon}
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-6 sm:p-8 flex flex-col flex-1">
                                <div className="flex items-center gap-1 text-amber-400 mb-3">
                                    <Star size={16} fill="currentColor" />
                                    <span className="text-slate-600 font-medium text-sm ml-1">{product.rating}</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3 leading-snug">{product.title}</h3>
                                <p className="text-slate-600 mb-6 flex-1 text-sm leading-relaxed">
                                    {product.description}
                                </p>

                                <div className="mt-auto">
                                    <div className="flex items-end gap-2 mb-4">
                                        <span className="text-2xl font-bold text-slate-900">
                                            R$ {product.price.toFixed(2).replace('.', ',')}
                                        </span>
                                        {product.originalPrice && (
                                            <span className="text-sm text-slate-400 line-through mb-1">
                                                R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                                            </span>
                                        )}
                                    </div>
                                    <Link to={`/materiais/${product.id}`} className="w-full bg-sky-600 text-white font-bold py-3 rounded-xl hover:bg-sky-700 transition-colors shadow-sm active:scale-[0.98] text-center inline-block">
                                        Ver Detalhes do Produto
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* Mini Footer */}
            <footer className="bg-white border-t border-slate-200 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500">
                    <p>O acesso aos materiais é enviado imediatamente para o seu e-mail após a confirmação do pagamento.</p>
                </div>
            </footer>
        </div>
    );
};
