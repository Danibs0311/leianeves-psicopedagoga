import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ShieldCheck, Star } from 'lucide-react';
import { getProductById } from '../data/products';

export const ProductSalesPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const product = getProductById(Number(id));

    useEffect(() => {
        // Rola a página para o topo sempre que carregar um novo produto
        window.scrollTo(0, 0);
    }, [id]);

    if (!product) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold text-slate-800 mb-4">Produto não encontrado</h1>
                <p className="text-slate-600 mb-8">Desculpe, não conseguimos encontrar o material que você estava procurando.</p>
                <Link to="/materiais" className="bg-sky-600 text-white px-6 py-3 rounded-full hover:bg-sky-700 transition flex items-center gap-2">
                    <ArrowLeft size={20} />
                    Voltar para a Loja
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-inter">
            {/* Header Mínimo (Foco na Venda) */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 sm:h-20">
                        <Link to="/materiais" className="text-slate-500 hover:text-sky-600 transition-colors flex items-center gap-2 font-medium">
                            <ArrowLeft size={20} />
                            Voltar
                        </Link>
                        <span className="text-xl font-bold text-sky-700 tracking-tight">
                            Léia<span className="text-sky-500">Neves</span>
                        </span>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-white py-12 md:py-20 border-b border-slate-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
                            {/* Product Visual (Mockup) */}
                            <div className="w-full lg:w-1/2 flex justify-center">
                                <div className="max-w-sm w-full bg-gradient-to-br from-sky-50 to-indigo-100 rounded-[2rem] p-12 aspect-[4/5] flex flex-col items-center justify-center shadow-lg relative border border-white">
                                    {product.tag && (
                                        <div className="absolute top-6 left-6 bg-yellow-400 text-yellow-900 text-sm font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                                            {product.tag}
                                        </div>
                                    )}
                                    <div className="transform scale-150 mb-8 opacity-90 drop-shadow-md">
                                        {product.icon}
                                    </div>
                                    <h2 className="text-center font-bold text-slate-800 text-xl leading-tight">
                                        {product.title}
                                    </h2>
                                </div>
                            </div>

                            {/* Product Info & Buy Action */}
                            <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
                                <div className="flex items-center gap-1 text-amber-500 mb-4 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                                    <Star size={16} fill="currentColor" />
                                    <Star size={16} fill="currentColor" />
                                    <Star size={16} fill="currentColor" />
                                    <Star size={16} fill="currentColor" />
                                    <Star size={16} fill="currentColor" />
                                    <span className="text-amber-700 font-bold text-sm ml-1">{product.rating.toFixed(1)}</span>
                                </div>

                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                                    {product.title}
                                </h1>

                                <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-xl">
                                    {product.longDescription || product.description}
                                </p>

                                <div className="bg-slate-50 border border-slate-200 w-full max-w-md rounded-2xl p-6 mb-8 flex flex-col items-center lg:items-start">
                                    <div className="flex items-end gap-3 mb-2">
                                        <span className="text-4xl font-extrabold text-slate-900">
                                            R$ {product.price.toFixed(2).replace('.', ',')}
                                        </span>
                                        {product.originalPrice && (
                                            <span className="text-lg text-slate-400 line-through mb-1 font-medium">
                                                R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-green-600 font-semibold flex items-center gap-1 mb-6">
                                        <ShieldCheck size={16} /> Compra 100% Segura
                                    </p>

                                    <button
                                        onClick={() => alert("Integração de pagamento pendente (Ex: Checkout Hotmart/Kiwify).")}
                                        className="w-full py-4 bg-sky-600 hover:bg-sky-700 text-white text-lg font-bold rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98] animate-pulse-subtle"
                                    >
                                        Garantir Meu Acesso Agora
                                    </button>
                                </div>
                                <p className="text-slate-500 text-sm flex items-center gap-2">
                                    <CheckCircle2 size={16} className="text-sky-500" />
                                    Acesso imediato enviado para o seu e-mail.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                {product.benefits && product.benefits.length > 0 && (
                    <section className="py-16 bg-slate-50">
                        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-900 mb-10">
                                O que você vai receber e como vai ajudar
                            </h2>
                            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm">
                                <ul className="space-y-5">
                                    {product.benefits.map((benefit, index) => (
                                        <li key={index} className="flex items-start gap-4">
                                            <div className="mt-1 bg-sky-100 text-sky-600 rounded-full p-1 flex-shrink-0">
                                                <CheckCircle2 size={20} />
                                            </div>
                                            <span className="text-slate-700 text-lg leading-relaxed">{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </section>
                )}
            </main>

            <footer className="bg-slate-900 text-slate-400 py-12 text-center">
                <div className="max-w-7xl mx-auto px-4">
                    <span className="text-2xl font-bold text-white tracking-tight block mb-4">
                        Léia<span className="text-sky-500">Neves</span>
                    </span>
                    <p className="text-sm mb-4">Os resultados podem variar de pessoa para pessoa.</p>
                    <p className="text-xs">© {new Date().getFullYear()} Léia Neves. Todos os direitos reservados.</p>
                </div>
            </footer>
        </div>
    );
};
