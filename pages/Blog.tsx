
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Calendar, User, ChevronRight, Search } from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  image_url: string;
  created_at: string;
  category: string;
}

export const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#fafbfc] flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        {/* Header Section - Modern & Emotional */}
        <section className="relative overflow-hidden bg-white py-24 px-6 border-b border-slate-100">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-50/50 -skew-x-12 translate-x-32"></div>
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="max-w-2xl">
              <span className="text-indigo-600 font-black text-xs uppercase tracking-[0.3em] mb-4 block">Portal de Conhecimento</span>
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 leading-[1.1] tracking-tighter">
                Educar para <span className="text-indigo-600">Transformar</span>.
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed font-medium">
                Dicas práticas, orientações clínicas e as últimas atualizações sobre desenvolvimento infantil em <span className="text-indigo-900 font-bold underline decoration-indigo-300 underline-offset-4">Cajazeiras, Salvador</span>.
              </p>
            </div>
          </div>
        </section>

        {/* Search & Filter Bar - Glassmorphism */}
        <div className="max-w-6xl mx-auto px-6 -mt-10 relative z-20">
          <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-indigo-100 p-3 border border-white/50 flex flex-col md:flex-row gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Busque por sintomas, leis ou tratamentos..." 
                className="w-full pl-14 pr-6 py-5 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-medium transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95">
              Buscar
            </button>
          </div>
        </div>

        {/* Posts Grid - Premium Cards */}
        <section className="max-w-6xl mx-auto px-6 py-24">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
              <p className="mt-6 text-slate-400 font-bold tracking-widest uppercase text-xs">Carregando Saber...</p>
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredPosts.map((post) => (
                <Link 
                  key={post.id} 
                  to={`/blog/${post.slug}`}
                  className="group relative flex flex-col bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 hover:border-indigo-100 shadow-sm hover:shadow-[0_20px_50px_rgba(79,70,229,0.1)] transition-all duration-500"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={post.image_url || 'https://images.unsplash.com/photo-1594608661623-aa0bd3a67d28?auto=format&fit=crop&q=80&w=1000'} 
                      alt={post.title}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1594608661623-aa0bd3a67d28?auto=format&fit=crop&q=80&w=1000';
                      }}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <div className="absolute top-6 left-6">
                      <span className="bg-white/95 backdrop-blur-sm text-indigo-600 text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest shadow-lg">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-8 flex-grow flex flex-col">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 text-[10px] font-black">
                        LN
                      </div>
                      <span className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">
                        {new Date(post.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors leading-[1.3] line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-slate-500 text-base leading-relaxed mb-8 line-clamp-3 font-medium">
                      {post.excerpt}
                    </p>
                    
                    <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                      <span className="text-indigo-600 font-black text-xs uppercase tracking-wider flex items-center gap-2 group-hover:gap-3 transition-all">
                        Continuar Lendo <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Nenhum saber encontrado</h3>
              <p className="text-slate-500">Tente buscar por termos diferentes ou explore as categorias.</p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};
