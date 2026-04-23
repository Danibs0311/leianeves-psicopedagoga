import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Search, ChevronRight, X } from 'lucide-react';

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

  const categories = [
    'TEA (Autismo)', 
    'TDAH', 
    'Alfabetização', 
    'Desenvolvimento', 
    'Apoio Familiar'
  ];

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }

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
      <Navbar onOpenScheduling={() => {}} />
      
      {/* Page Header */}
      <div className="border-b border-slate-100 py-10 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Blog Profissional</h1>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
            <Link to="/" className="hover:text-sky-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-900">Blog</span>
          </div>
        </div>
      </div>

      <main className="max-w-[1440px] mx-auto px-6 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* 1. SIDEBAR - LEFT (Col Span 3) */}
          <aside className="lg:col-span-3 flex flex-col gap-14">
            
            {/* Search */}
            <div className="relative">
              <input 
                type="text" 
                placeholder="Buscar artigos..." 
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:border-sky-300 transition-all text-slate-600 font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            </div>

            {/* Categories (FILTERS) */}
            <section>
              <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-3">
                <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em]">Tópicos</h3>
                {selectedCategory && (
                  <button 
                    onClick={() => setSelectedCategory(null)}
                    className="text-[9px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-1 hover:text-rose-600 transition-colors"
                  >
                    Limpar <X size={10} />
                  </button>
                )}
              </div>
              <ul className="flex flex-col gap-4">
                {categories.map((cat) => (
                  <li key={cat}>
                    <button 
                      onClick={() => setSelectedCategory(cat)}
                      className={`text-[13px] font-bold transition-all text-left w-full hover:translate-x-1 ${
                        selectedCategory === cat ? 'text-sky-600 pl-2 border-l-2 border-sky-600' : 'text-slate-400 hover:text-sky-600'
                      }`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            {/* Popular Posts */}
            <section>
              <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] mb-8 border-b border-slate-100 pb-3">Mais Lidos</h3>
              <div className="flex flex-col gap-8">
                {[
                  "Sinais precoces no desenvolvimento",
                  "Estratégias para foco e atenção",
                  "Alfabetização inclusiva: por onde começar"
                ].map((title, idx) => (
                  <div key={idx} className="flex gap-4 items-start group cursor-pointer">
                    <span className="text-4xl font-black text-slate-50 group-hover:text-sky-50 transition-colors leading-none">{idx + 1}</span>
                    <div className="flex flex-col gap-1">
                      <h4 className="text-[13px] font-black text-slate-700 leading-snug group-hover:text-sky-600 transition-colors line-clamp-2">{title}</h4>
                      <span className="text-[9px] text-slate-300 font-bold uppercase tracking-widest mt-1">Léia Neves</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Instagram Grid (Visual Reference) */}
            <section>
              <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] mb-8 border-b border-slate-100 pb-3">Instagram</h3>
              <div className="grid grid-cols-3 gap-2">
                {[1,2,3,4,5,6].map((i) => (
                  <div key={i} className="aspect-square bg-slate-50 rounded-lg overflow-hidden hover:opacity-80 transition-opacity">
                    <img 
                      src={`https://images.unsplash.com/photo-1594608661623-aa0bd3a67d28?auto=format&fit=crop&q=80&w=200&sig=${i}`} 
                      alt="Instagram" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                ))}
              </div>
            </section>
          </aside>

          {/* 2. ARTICLES GRID - RIGHT (Col Span 9) */}
          <section className="lg:col-span-9">
            {loading ? (
              <div className="flex justify-center py-40">
                <div className="w-10 h-10 border-4 border-slate-50 border-t-sky-600 rounded-full animate-spin"></div>
              </div>
            ) : filteredPosts.length > 0 ? (
              /* GRID WITH 3 COLUMNS ON XL SCREENS */
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
                {filteredPosts.map((post) => (
                  <Link 
                    key={post.id} 
                    to={`/blog/${post.slug}`} 
                    className="group flex flex-col bg-white"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden rounded-2xl mb-6 shadow-sm">
                      <img 
                        src={post.image_url} 
                        alt={post.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                    </div>
                    
                    <div className="flex items-center gap-3 text-[9px] font-black text-sky-600 uppercase tracking-[0.2em] mb-3">
                      <span>{post.category}</span>
                      <span className="w-1 h-1 bg-slate-100 rounded-full"></span>
                      <span className="text-slate-300">{new Date(post.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                    
                    <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-sky-600 transition-colors leading-tight tracking-tight line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-slate-500 text-[13px] leading-relaxed line-clamp-3 mb-6 font-medium">
                      {post.excerpt}
                    </p>
                    
                    <div className="mt-auto text-sky-600 font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 group-hover:gap-4 transition-all">
                      Ler Artigo <ChevronRight className="w-4 h-4" strokeWidth={3} />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-40 bg-slate-50 rounded-[3rem] border border-slate-100 border-dashed">
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] italic">
                  {selectedCategory 
                    ? `Nenhum artigo encontrado em "${selectedCategory}"` 
                    : "Nenhum artigo encontrado para esta busca."}
                </p>
                {selectedCategory && (
                  <button 
                    onClick={() => setSelectedCategory(null)}
                    className="mt-4 text-sky-600 font-black text-[10px] uppercase tracking-widest hover:underline"
                  >
                    Ver todos os artigos
                  </button>
                )}
              </div>
            )}

            {/* Pagination Placeholder */}
            {filteredPosts.length > 0 && (
              <div className="flex items-center justify-center gap-3 mt-32 pt-16 border-t border-slate-100">
                <button className="w-12 h-12 flex items-center justify-center bg-slate-900 text-white text-xs font-black rounded-xl shadow-xl shadow-slate-200">1</button>
                <button className="w-12 h-12 flex items-center justify-center bg-white text-slate-400 border border-slate-100 text-xs font-bold rounded-xl hover:bg-slate-50 transition-all">2</button>
                <button className="w-12 h-12 flex items-center justify-center bg-white text-slate-400 border border-slate-100 text-xs font-bold rounded-xl hover:bg-slate-50 transition-all">
                  <ChevronRight className="w-5 h-5" />
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
