import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Search, ChevronRight, X, AlertCircle } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image_url: string;
  category: string;
  created_at: string;
}

export const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = ['TEA (Autismo)', 'TDAH', 'Alfabetização', 'Desenvolvimento', 'Apoio Familiar'];

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let query = supabase.from('blog_posts').select('*').eq('is_published', true).order('created_at', { ascending: false });
      if (selectedCategory) query = query.eq('category', selectedCategory);
      const { data, error } = await query;
      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans overflow-x-hidden">
      {/* VERIFICATION TAG - To ensure you are seeing the latest version */}
      <div className="bg-amber-400 py-2 text-center text-[10px] font-black uppercase tracking-[0.3em] text-amber-950">
        SISTEMA ATUALIZADO - MODO 3 COLUNAS ATIVO
      </div>

      <Navbar onOpenScheduling={() => {}} />
      
      {/* Header */}
      <div className="border-b border-slate-100 py-10 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 flex justify-between items-center">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Blog Profissional</h1>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
            <Link to="/" className="hover:text-sky-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-900">Blog</span>
          </div>
        </div>
      </div>

      <main className="max-w-[1440px] mx-auto px-6 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20">
          
          {/* SIDEBAR - LEFT */}
          <aside className="lg:col-span-4 xl:col-span-3 flex flex-col gap-12">
            {/* Search */}
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Buscar artigos..." 
                className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:border-sky-400 focus:bg-white focus:shadow-lg focus:shadow-sky-50 transition-all font-semibold text-slate-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-sky-500 transition-colors" />
            </div>

            {/* Topics Filter */}
            <section className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100">
              <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em]">Categorias</h3>
                {selectedCategory && (
                  <button onClick={() => setSelectedCategory(null)} className="text-[9px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-1 hover:text-rose-600 transition-colors">
                    Limpar <X size={10} />
                  </button>
                )}
              </div>
              <ul className="flex flex-col gap-3">
                {categories.map((cat) => (
                  <li key={cat}>
                    <button 
                      onClick={() => setSelectedCategory(cat)}
                      className={`text-[14px] font-bold py-2 px-4 rounded-xl transition-all text-left w-full flex justify-between items-center ${
                        selectedCategory === cat 
                        ? 'bg-sky-600 text-white shadow-lg shadow-sky-100 translate-x-2' 
                        : 'text-slate-500 hover:text-sky-600 hover:bg-white hover:translate-x-1'
                      }`}
                    >
                      {cat}
                      <ChevronRight size={14} className={selectedCategory === cat ? 'opacity-100' : 'opacity-0'} />
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            {/* Popular */}
            <section className="px-4">
              <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] mb-10 border-b border-slate-100 pb-4">Destaques Semanais</h3>
              <div className="flex flex-col gap-10">
                {[1, 2, 3].map((idx) => (
                  <div key={idx} className="flex gap-5 items-center group cursor-pointer">
                    <div className="relative">
                      <span className="text-5xl font-black text-slate-100 group-hover:text-sky-50 transition-colors leading-none italic">{idx}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h4 className="text-[14px] font-bold text-slate-700 leading-tight group-hover:text-sky-600 transition-colors line-clamp-2">Estratégias avançadas para o desenvolvimento cognitivo infantil</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] text-sky-500 font-black uppercase tracking-widest">Léia Neves</span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                        <span className="text-[9px] text-slate-300 font-bold">5 min leitura</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Instagram Widget */}
            <section className="bg-sky-600 p-8 rounded-[2rem] text-white overflow-hidden relative group">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] mb-6 relative z-10">Instagram</h3>
              <div className="grid grid-cols-3 gap-2 relative z-10">
                {[1,2,3,4,5,6].map((i) => (
                  <div key={i} className="aspect-square bg-white/10 rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer border border-white/5">
                    <img src={`https://images.unsplash.com/photo-1594608661623-aa0bd3a67d28?auto=format&fit=crop&q=80&w=200&sig=${i}`} alt="ig" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-3 bg-white/10 hover:bg-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all hover:text-sky-600 border border-white/20 relative z-10">
                Seguir @leianeves
              </button>
            </section>
          </aside>

          {/* ARTICLES GRID - RIGHT */}
          <section className="lg:col-span-8 xl:col-span-9">
            {loading ? (
              <div className="flex justify-center py-40">
                <div className="w-12 h-12 border-4 border-slate-50 border-t-sky-600 rounded-full animate-spin"></div>
              </div>
            ) : filteredPosts.length > 0 ? (
              <div className="flex flex-col gap-8">
                {filteredPosts.map((post) => (
                  <Link 
                    key={post.id} 
                    to={`/blog/${post.slug}`} 
                    className="group flex flex-col md:flex-row gap-8 items-center bg-white p-5 md:p-6 rounded-[2rem] border border-slate-100 hover:border-sky-200 hover:shadow-2xl hover:shadow-sky-100/30 transition-all duration-500"
                  >
                    <div className="relative w-full md:w-56 lg:w-64 aspect-[16/10] md:aspect-square flex-shrink-0 overflow-hidden rounded-[1.25rem] shadow-sm bg-slate-50">
                      <img 
                        src={post.image_url} 
                        alt={post.title} 
                        loading="lazy" 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    <div className="flex flex-col gap-3 w-full pr-4">
                      <div className="flex items-center gap-3 text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">
                        <span className="text-sky-500 font-black">{post.category}</span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                        <span>{new Date(post.created_at).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <h3 className="text-xl lg:text-2xl font-black text-slate-900 group-hover:text-sky-600 transition-colors leading-tight line-clamp-2 font-display">
                        {post.title}
                      </h3>
                      <p className="text-slate-500 text-sm lg:text-base leading-relaxed line-clamp-2 font-medium max-w-2xl">
                        {post.excerpt}
                      </p>
                      <div className="mt-2 flex items-center gap-3 text-sky-600 font-black text-[10px] uppercase tracking-[0.2em] group-hover:translate-x-2 transition-transform duration-500">
                        Ler Artigo Completo <ChevronRight className="w-4 h-4" strokeWidth={3} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-40 bg-slate-50/50 rounded-[4rem] border border-slate-100 border-dashed">
                <AlertCircle size={40} className="mx-auto text-slate-200 mb-6" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px]">Nenhum artigo encontrado para sua busca.</p>
                <button 
                  onClick={() => {setSearchTerm(''); setSelectedCategory(null);}}
                  className="mt-6 px-8 py-4 bg-white border border-slate-200 rounded-xl text-sky-600 font-black text-[10px] uppercase tracking-widest hover:bg-sky-50 transition-colors shadow-sm"
                >
                  Ver todos os artigos
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
